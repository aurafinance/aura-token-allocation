import { Map } from 'immutable'
import { parseUnits } from 'ethers/lib/utils'
import chalk from 'chalk'

import { Accounts, Data } from '../types'
import { notInAccountLists } from '../account-lists'
import { Account, SnapshotVote } from '../Account'
import { BAL } from '../constants'
import { exactToSimple, parseBigDecimal } from '../utils'
import { filterAllowedAddresses } from '../fetch/filterAllowedAddresses'
import { writeData } from '../fetch/data'

export const getAllAccounts = async (data: Data): Promise<Accounts> => {
  let allAccounts: Accounts = Map()

  data.snapshot.votes
    .map((record) => ({ ...record, account: record.voter.toLowerCase() }))
    .filter(({ account }) => notInAccountLists(account))
    .forEach(({ account, vp, choice }) => {
      const vote = choice === 1 ? SnapshotVote.Yes : SnapshotVote.No
      const votingPower = parseUnits(vp.toFixed(18))

      allAccounts = allAccounts.update(account, (_account) =>
        _account
          ? _account.set('vote', vote).set('votingPower', votingPower)
          : Account({ address: account, vote, votingPower }),
      )
    })

  data.dune.vlCVX
    .map((record) => ({ ...record, account: record.account.toLowerCase() }))
    .filter(({ account }) => notInAccountLists(account))
    .forEach((record) => {
      const address = record.account
      const vlCVX = parseUnits(record.amount.toFixed(18))

      allAccounts = allAccounts.update(address, (account) =>
        account ? account.set('vlCVX', vlCVX) : Account({ address, vlCVX }),
      )
    })

  console.log(
    `Total vlCVX (dune): ${chalk.blueBright(
      data.dune.vlCVX.reduce((prev, record) => prev + record.amount, 0),
    )}`,
  )

  // Dune Balancer holdings
  ;[data.dune.balMainnet, data.dune.balPolygon]
    .flat()
    .map((record) => ({ ...record, account: record.account.toLowerCase() }))
    .filter(({ account }) => notInAccountLists(account))
    .forEach((record) => {
      const balance = parseUnits(record.amount.toFixed(18))
      allAccounts = allAccounts.update(record.account, (account) =>
        account
          ? account.update('BAL', (value) => value.add(balance))
          : Account({ address: record.account, BAL: balance }),
      )
    })

  console.log(
    `Total BAL (dune, mainnet): ${chalk.blueBright(
      data.dune.balMainnet.reduce((prev, record) => prev + record.amount, 0),
    )}`,
  )
  console.log(
    `Total BAL (dune, polygon): ${chalk.blueBright(
      data.dune.balPolygon.reduce((prev, record) => prev + record.amount, 0),
    )}`,
  )

  // BAL held per account over all LP
  const pools = Object.values(data.graph.balancer.pools)
    .flat()
    .map(({ shares, tokens, totalShares, id }) => {
      const bal = tokens.find((t) =>
        Object.values(BAL).includes(t.address.toLowerCase()),
      )
      if (!bal) throw new Error(`BAL not found in pool ${id}`)

      const balPerBPT =
        (parseFloat(bal.weight) * parseFloat(bal.balance)) /
        parseFloat(totalShares)

      return Object.fromEntries(
        shares
          .filter((share) => {
            return notInAccountLists(share.userAddress.id.toLowerCase())
          })
          .map((share) => {
            const amtBal = share.balance * balPerBPT
            const amtBalExact = parseBigDecimal(amtBal)

            const address = share.userAddress.id.toLowerCase()
            return [address, amtBalExact]
          }),
      )
    })

  pools.forEach((balances) => {
    Object.entries(balances).forEach(([address, balance]) => {
      allAccounts = allAccounts.update(address, (account) =>
        account
          ? account.update('BAL', (value) => value.add(balance))
          : Account({ address, BAL: balance }),
      )
    })
  })
  console.log(
    `Total BAL in pools (graph): ${chalk.blueBright(
      pools.reduce(
        (prev, balances) =>
          prev +
          Object.values(balances).reduce(
            (_prev, balance) => _prev + exactToSimple(balance),
            0,
          ),
        0,
      ),
    )}`,
  )

  // Voting escrow locked balances
  const lockedBalances = Object.fromEntries(
    data.graph.balancer.votingEscrowLocks
      .map((record) => ({
        ...record,
        account: record.id.split('-')[0].toLowerCase(),
      }))
      .filter(({ account }) => notInAccountLists(account))
      .map((record) => {
        // 80BAL-20WETH
        const balance = parseUnits((record.lockedBalance * 0.8).toFixed(18))
        return [record.account, balance]
      }),
  )
  Object.entries(lockedBalances).forEach(
    ([address, balance]) =>
      (allAccounts = allAccounts.update(address, (account) =>
        account
          ? account.update('BAL', (value) => value.add(balance))
          : Account({ address, BAL: balance }),
      )),
  )
  console.log(
    `Total locked BAL (graph): ${chalk.blueBright(
      Object.values(lockedBalances).reduce(
        (prev, balance) => prev + exactToSimple(balance),
        0,
      ),
    )}`,
  )

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

  await writeData(
    'filtered-accounts.json',
    Array.from(filtered.notAllowed.values()),
  )

  return accounts
}
