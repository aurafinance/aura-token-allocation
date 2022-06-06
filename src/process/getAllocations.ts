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
  filterAccounts,
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
    filterAccounts,
  }

  const accounts = pipeline(
    () => pipelineArgs,
    explain('All accounts'),
    applyRedirections,
    applyRedirections,
    explain('Redirected accounts'),
    maybeFilterAccounts,
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

// Filter accounts if the drop specifies it (e.g. for non-lobster holders in the lobster drop)
const maybeFilterAccounts = (pipelineArgs) =>
  pipelineArgs.filterAccounts
    ? {
        ...pipelineArgs,
        accounts: pipelineArgs.filterAccounts(pipelineArgs.accounts),
      }
    : pipelineArgs
