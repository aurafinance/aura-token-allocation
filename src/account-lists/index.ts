import other from './other.json'
import balancerDao from './balancer-dao.json'
import balancerPools from './balancer-pools.json'
import infra from './infra.json'

import { logger } from '../logger'

const lists = [other, balancerDao, balancerPools, infra].map(
  ({ accounts, ...list }) => ({
    ...list,
    accounts: Object.fromEntries(
      Object.entries(accounts).map(([account, label]) => [
        account.toLowerCase(),
        label,
      ]),
    ),
  }),
)

export const notInAccountLists = (account: string) => {
  const idx = lists.findIndex((list) => list.accounts[account.toLowerCase()])
  const match = lists[idx]
  if (match) {
    logger.info(
      `Excluding ${account}: ${match.name} (${match.accounts[account]})`,
    )
    return false
  }
  return true
}
