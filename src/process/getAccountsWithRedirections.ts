import { Map } from 'immutable'
import { parseUnits } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'

import { Accounts, Data } from '../types'
import { notInAccountLists } from '../account-lists'
import { Account, SnapshotVote } from '../Account'
import { BAL } from '../constants'
import { exactToSimple, parseBigDecimal } from '../utils'
import { filterAllowedAddresses } from './filterAllowedAddresses'
import { writeData } from '../fetch/data'
import { getRedirections } from './getRedirections'
import { Redirection } from './types'
import { logger } from '../logger'

const WHITELIST_ADDITIONS = [
  '0xc4eac760c2c631ee0b064e39888b89158ff808b2', // Tribe VeBalDelegatorPCVDeposit
]

export const getAccountsWithRedirections = async (
  data: Data,
): Promise<{ accounts: Accounts; redirections: Redirection[] }> => {
  const redirections = await getRedirections()

  // Create a whitelist by flattening all redirection addresses
  const whitelist = new Set<string>([
    ...WHITELIST_ADDITIONS,
    ...redirections
      .map((redirection) =>
        Object.entries(redirection).map(([source, dest]) => [
          source,
          typeof dest === 'string' ? dest : Object.keys(dest),
        ]),
      )
      .flat(3),
  ])

  const allAccounts: Accounts = Map(
    // Initial value: all whitelist addresses
    [...whitelist.values()].map((address) => [address, Account({ address })]),
  ).withMutations((mutable) => {
    Object.entries(data.nftHolders.lobsterDao).forEach(([address, count]) => {
      mutable.set(
        address,
        mutable.get(address, Account({ address })).set('lobsterDao', count),
      )
    })

    data.snapshot.votes
      .map((record) => ({ ...record, account: record.voter.toLowerCase() }))
      .filter(({ account }) => notInAccountLists(account))
      .forEach(({ account, vp, choice }) => {
        const vote = choice === 1 ? SnapshotVote.Yes : SnapshotVote.No
        const votingPower = parseUnits(vp.toFixed(18))

        mutable.set(
          account,
          mutable.get(
            account,
            Account({ address: account })
              .set('vote', vote)
              .set('votingPower', votingPower),
          ),
        )
      })

    data.dune.vlCVX
      .map((record) => ({ ...record, account: record.account.toLowerCase() }))
      .filter(({ account }) => notInAccountLists(account))
      .forEach((record) => {
        const address = record.account
        const vlCVX = parseUnits(record.amount.toFixed(18))

        mutable.set(
          address,
          mutable.get(address, Account({ address })).set('vlCVX', vlCVX),
        )
      })

    logger.info(
      `Total vlCVX (dune): ${data.dune.vlCVX.reduce(
        (prev, record) => prev + record.amount,
        0,
      )}`,
    )

    // Dune Balancer holdings
    ;[data.dune.balMainnet, data.dune.balPolygon]
      .flat()
      .map((record) => ({ ...record, account: record.account.toLowerCase() }))
      .filter(({ account }) => notInAccountLists(account))
      .forEach((record) => {
        const balance = parseUnits(record.amount.toFixed(18))
        mutable.set(
          record.account,
          mutable
            .get(record.account, Account({ address: record.account }))
            .update('BAL', (value) => value.add(balance)),
        )
      })
    logger.info(
      `Total BAL (dune, mainnet): ${data.dune.balMainnet.reduce(
        (prev, record) => prev + record.amount,
        0,
      )}`,
    )
    logger.info(
      `Total BAL (dune, polygon): ${data.dune.balPolygon.reduce(
        (prev, record) => prev + record.amount,
        0,
      )}`,
    )

    // Arbitrum Balancer holdings (via Covalent API)
    data.balArbitrum
      .map((record) => ({ ...record, account: record.account.toLowerCase() }))
      .filter(({ account }) => notInAccountLists(account))
      .forEach((record) => {
        const balance = parseUnits(record.amount.toFixed(18))
        mutable.set(
          record.account,
          mutable
            .get(record.account, Account({ address: record.account }))
            .update('BAL', (value) => value.add(balance)),
        )
      })
    logger.info(
      `Total BAL (covalent, arbitrum): ${data.balArbitrum.reduce(
        (prev, record) => prev + record.amount,
        0,
      )}`,
    )

    // BAL held per account over all LP
    const pools = Object.values(data.graph.balancer.pools)
      .flat()
      .map((pool) => {
        const { id, tokens, shares } = pool

        if (shares.length === 0) return {}

        const bal = tokens.find((t) =>
          Object.values(BAL).includes(t.address.toLowerCase()),
        )
        if (!bal) throw new Error(`BAL not found in pool ${id}`)

        logger.info(`BAL in pool ${id}: ${bal.balance}`)

        const totalShares = parseFloat(pool.totalShares)
        const balInPool = parseFloat(bal.balance)

        return Object.fromEntries(
          shares
            .filter((share) => {
              return notInAccountLists(share.userAddress.id.toLowerCase())
            })
            .map((share) => {
              const shareOfPool = parseFloat(share.balance) / totalShares
              const amtBal = shareOfPool * balInPool
              const amtBalExact = parseBigDecimal(amtBal)

              const address = share.userAddress.id.toLowerCase()
              return [address, amtBalExact]
            }),
        )
      })

    pools.forEach((balances) => {
      Object.entries(balances).forEach(([address, balance]) => {
        mutable.set(
          address,
          mutable
            .get(address, Account({ address }))
            .update('BAL', (value) => value.add(balance)),
        )
      })
    })
    logger.info(
      `Total BAL in pools (graph): ${pools.reduce(
        (prev, balances) =>
          prev +
          Object.values(balances).reduce(
            (_prev, balance) => _prev + exactToSimple(balance),
            0,
          ),
        0,
      )}`,
    )

    // Voting escrow locked balances
    const lockedBalances = Object.fromEntries(
      data.graph.balancer.votingEscrows.locks
        .map<[string, BigNumber]>(({ id, lockedBalance }) => {
          // User address is first half
          const address = id.split('-')[0].toLowerCase()
          // Get BAL value
          const amount = parseUnits(
            (parseFloat(lockedBalance) * 2.2).toString(),
          )
          return [address, amount]
        })
        .filter(([account]) => notInAccountLists(account)),
    )
    Object.entries(lockedBalances).forEach(([address, balance]) =>
      mutable.set(
        address,
        mutable
          .get(address, Account({ address }))
          .update('BAL', (value) => value.add(balance)),
      ),
    )
    logger.info(
      `Total locked BAL (graph): ${Object.values(lockedBalances).reduce(
        (prev, balance) => prev + exactToSimple(balance),
        0,
      )}`,
    )
  })

  const filtered = await filterAllowedAddresses(
    allAccounts
      .map((account) => account.get('address'))
      .valueSeq()
      .toArray(),
    whitelist,
  )

  const accounts = allAccounts.filter((account) =>
    filtered.allowed.has(account.get('address')),
  )

  logger.info(
    `Account exclusions (i.e. not EOA/Safe/etc) ${filtered.notAllowed.size} (${filtered.allowed.size} remaining)`,
  )

  await writeData(
    'filtered-accounts.json',
    Array.from(filtered.notAllowed.values()),
  )

  return { accounts, redirections }
}
