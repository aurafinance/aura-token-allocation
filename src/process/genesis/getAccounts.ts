import { Accounts, Data } from '../../types'
import { Map } from 'immutable'
import { notInAccountLists } from '../../account-lists'
import { Account, SnapshotVote } from '../../Account'
import { parseUnits } from 'ethers/lib/utils'
import { BAL } from '../../constants'
import { mulTruncate, parseBigDecimal } from '../../utils'

export const getAccounts = (data: Data): Accounts => {
  let accounts: Accounts = Map()

  data.snapshot.votes
    .filter(({ voter }) => notInAccountLists(voter))
    .forEach(({ voter, vp, choice }) => {
      const account = Account({
        address: voter,
        vote: choice === 1 ? SnapshotVote.Yes : SnapshotVote.No,
        votingPower: parseUnits(vp.toFixed(18)),
      })

      accounts = accounts.mergeIn([account.get('address')], account)
    })

  data.dune.vlCVX
    .filter(({ account }) => notInAccountLists(account))
    .forEach((record) => {
      const account = Account({
        address: record.account,
        vlCVX: parseUnits(record.amount.toString()),
      })

      accounts = accounts.mergeIn([account.get('address')], account)
    })

  data.dune.BAL.filter(({ account }) => notInAccountLists(account)).forEach(
    (record) => {
      const account = Account({
        address: record.account,
        BAL: parseUnits(record.amount.toString()),
      })

      accounts = accounts.mergeIn([account.get('address')], account)
    },
  )

  // BAL held per account over all LP
  Object.values(data.graph.balancer.pools)
    .flat()
    .forEach(({ shares, tokens, id }) => {
      const bal = tokens.find((t) =>
        Object.values(BAL).includes(t.address.toLowerCase()),
      )
      if (!bal) throw new Error(`BAL not found in pool ${id}`)

      const balPerBPT = mulTruncate(
        parseBigDecimal(bal.weight),
        parseBigDecimal(bal.balance),
      )

      shares
        .filter((share) => {
          // TODO this invalidates balPerBPT by excluding users
          return notInAccountLists(share.userAddress.id.toLowerCase())
        })
        .forEach((share) => {
          const balance = parseBigDecimal(share.balance)
          const amtBal = mulTruncate(balPerBPT, balance)

          const address = share.userAddress.id.toLowerCase()
          const account = accounts
            .get(address, Account({ address }))
            .update('BAL', (value) => value.add(amtBal))

          accounts = accounts.mergeIn([address], account)
        })
    })

  return accounts
}
