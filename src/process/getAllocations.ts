import { OrderedMap } from 'immutable'
import { BigNumber } from 'ethers'
import { pipeline } from 'ts-pipe-compose'

import { Accounts, AllocationMap } from '../types'
import { ZERO } from '../constants'
import { rescale } from './rescale'
import { explain } from './explain'
import { cullShrimp } from './cullShrimp'
import { applyRedirections } from './applyRedirections'
import { PipelineArgs } from './types'

export const getAllocations = async ({
  id,
  allocationKey,
  totalAllocation,
  allAccounts,
  minAuraReward,
  scaleExponent,
  getBalances,
  redirections,
}: Omit<PipelineArgs, 'accounts'> & {
  allAccounts: Accounts
}): Promise<{
  allocations: AllocationMap
  accounts: Accounts
}> => {
  const pipelineArgs: PipelineArgs = {
    accounts: allAccounts,
    id,
    allocationKey,
    totalAllocation,
    scaleExponent,
    getBalances,
    minAuraReward,
    redirections,
  }

  const accounts = pipeline(
    () => pipelineArgs,
    explain('All accounts'),
    applyRedirections,
    applyRedirections,
    explain('Redirected accounts'),
    rescale,
    explain('Rescaled (before culling shrimp)'),
    cullShrimp,
    rescale,
    explain('Rescaled (final)'),
    (result) => result.accounts,
  )()

  const allocations: AllocationMap = OrderedMap(
    accounts
      .map<BigNumber>((account) =>
        account.get('allocation').get(allocationKey, ZERO),
      )
      .filter((value) => value.gt(0))
      .toOrderedMap()
      .sort((a, b) => (a.gt(b) ? -1 : 1)),
  )

  return { allocations, accounts }
}
