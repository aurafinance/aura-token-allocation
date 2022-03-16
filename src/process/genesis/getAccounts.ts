import { Map } from 'immutable'
import { parseUnits } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'

import { Accounts, Data } from '../../types'
import { notInAccountLists } from '../../account-lists'
import { Account, Allocation, SnapshotVote } from '../../Account'
import { BAL } from '../../constants'
import { parseBigDecimal } from '../../utils'

export const getAccounts = (data: Data): Accounts => {
  let accounts: Accounts = Map()

  data.snapshot.votes
    .filter(({ voter }) => notInAccountLists(voter))
    .forEach(({ voter, vp, choice }) => {
      const account = Account({
        address: voter,
        vote: choice === 1 ? SnapshotVote.Yes : SnapshotVote.No,
        rawBalances: Allocation({
          votingPower: parseUnits(vp.toFixed(18)),
        }),
      })

      accounts = accounts.mergeDeepIn([account.get('address')], account)
    })

  data.dune.vlCVX
    .filter(({ account }) => notInAccountLists(account))
    .forEach((record) => {
      const account = Account({
        address: record.account,
        rawBalances: Allocation({
          vlCVX: parseUnits(record.amount.toString()),
        }),
      })

      accounts = accounts.mergeDeepIn([account.get('address')], account)
    })
  ;[data.dune.balMainnet, data.dune.balPolygon]
    .flat()
    .filter(({ account }) => notInAccountLists(account))
    .forEach((record) => {
      accounts = accounts
        .set(record.account, Account({ address: record.account }))
        .updateIn([record.account, 'rawBalances', 'BAL'], (value: BigNumber) =>
          value.add(parseUnits(record.amount.toString())),
        )
    })

  // BAL held per account over all LP
  Object.values(data.graph.balancer.pools)
    .flat()
    .forEach(({ shares, tokens, totalShares, id }) => {
      const bal = tokens.find((t) =>
        Object.values(BAL).includes(t.address.toLowerCase()),
      )
      if (!bal) throw new Error(`BAL not found in pool ${id}`)

      const balPerBPT =
        (parseFloat(bal.weight) * parseFloat(bal.balance)) /
        parseFloat(totalShares)

      shares
        .filter((share) => {
          // TODO this invalidates balPerBPT by excluding users
          return notInAccountLists(share.userAddress.id.toLowerCase())
        })
        .forEach((share) => {
          const amtBal = share.balance * balPerBPT
          const amtBalExact = parseBigDecimal(amtBal)

          const address = share.userAddress.id.toLowerCase()
          const account = accounts
            .get(address, Account({ address }))
            .updateIn(['rawBalances', 'BAL'], (value: BigNumber) =>
              value.add(amtBalExact),
            )

          accounts = accounts.mergeIn([address], account)
        })
    })

  return accounts
}
