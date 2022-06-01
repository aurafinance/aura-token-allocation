import { BigNumber } from 'ethers'
import { Map } from 'immutable'

import { Accounts, MerkleDrop, MerkleDropId } from '../types'
import { ZERO } from '../constants'
import { createMerkleTree } from '../utils'
import { getAllocations } from './getAllocations'
import { AllocationProps } from '../Account'
import { Redirection } from './types'

export const createMerkleDrop = async ({
  id,
  allocationKey,
  totalAllocation,
  accounts: allAccounts,
  scaleExponent,
  minAuraReward,
  getBalances,
  redirections,
}: {
  id: MerkleDropId
  allocationKey: keyof AllocationProps
  totalAllocation: BigNumber
  accounts: Accounts
  scaleExponent?: number
  minAuraReward?: number
  getBalances(accounts: Accounts): Map<string, number>
  redirections: Redirection[]
}): Promise<MerkleDrop> => {
  const { allocations, accounts } = await getAllocations({
    id,
    allocationKey,
    totalAllocation,
    allAccounts,
    scaleExponent,
    minAuraReward,
    getBalances,
    redirections,
  })

  const merkleTree = createMerkleTree(allocations)

  const assignedAllocation = allocations.reduce(
    (prev, allocation) => prev.add(allocation),
    ZERO,
  )
  const totalDust = totalAllocation.sub(assignedAllocation)

  return {
    id,
    allocationKey,
    merkleTree,
    accounts,
    allocations,
    totalAllocation,
    totalDust,
  }
}
