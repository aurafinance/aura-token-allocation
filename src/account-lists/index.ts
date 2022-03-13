import badActors from './bad-actors.json'
import balancerDao from './balancer-dao.json'
import balancerPools from './balancer-pools.json'
import infra from './infra.json'

import chalk from 'chalk'

const lists = [badActors, balancerDao, balancerPools, infra]
const colours = [chalk.red, chalk.green, chalk.blue, chalk.gray]

export const notInAccountLists = (account: string) => {
  const idx = lists.findIndex((list) => list.accounts[account])
  const match = lists[idx]
  if (match) {
    console.info(
      `Excluding ${account}: ${colours[idx](
        `${match.name} (${match.accounts[account]})`,
      )}`,
    )
    return false
  }
  return true
}
