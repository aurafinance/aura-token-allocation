import { Map } from 'immutable'
import { parseUnits } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'
import chalk from 'chalk'

import { Accounts, Data } from '../../types'
import { notInAccountLists } from '../../account-lists'
import { Account, Allocation, SnapshotVote } from '../../Account'
import { BAL } from '../../constants'
import { parseBigDecimal } from '../../utils'
import { filterAllowedAddresses } from '../../fetch/filterAllowedAddresses'
import { writeCache } from '../../fetch/cache'

export const getAccounts = async (data: Data): Promise<Accounts> => {
  let allAccounts: Accounts = Map()

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

      allAccounts = allAccounts.mergeDeepIn([account.get('address')], account)
    })

  data.dune.vlCVX
    .filter(({ account }) => notInAccountLists(account))
    .forEach((record) => {
      const account = Account({
        address: record.account,
        rawBalances: Allocation({
          vlCVX: parseUnits(record.amount.toFixed(18)),
        }),
      })

      allAccounts = allAccounts.mergeDeepIn([account.get('address')], account)
    })
  ;[data.dune.balMainnet, data.dune.balPolygon]
    .flat()
    .filter(({ account }) => notInAccountLists(account))
    .forEach((record) => {
      allAccounts = allAccounts
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
          const account = allAccounts
            .get(address, Account({ address }))
            .updateIn(['rawBalances', 'BAL'], (value: BigNumber) =>
              value.add(amtBalExact),
            )

          allAccounts = allAccounts.mergeIn([address], account)
        })
    })

  const filtered = await filterAllowedAddresses(
    allAccounts
      .map((account) => account.get('address'))
      .valueSeq()
      .toArray(),
  )

  const accounts = allAccounts.filter((account) =>
    filtered.allowed.has(account.get('address')),
  )

  console.log(
    `Account exclusions (i.e. not EOA/Safe/etc) ${chalk.blueBright(
      filtered.notAllowed.size,
    )} (${chalk.blueBright(filtered.allowed.size)} remaining)`,
  )

  await writeCache(
    'filtered-accounts.json',
    Array.from(filtered.notAllowed.values()),
  )

  return accounts
}
