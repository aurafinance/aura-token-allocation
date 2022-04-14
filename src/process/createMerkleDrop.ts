import { BigNumber } from 'ethers'
import { Map } from 'immutable'

import { Accounts, MerkleDrop, MerkleDropId } from '../types'
import { ZERO } from '../constants'
import { createMerkleTree } from '../utils'
import { getAllocations } from './getAllocations'
import { AllocationProps } from '../Account'

export const createMerkleDrop = async ({
  id,
  allocationKey,
  totalAllocation,
  allAccounts,
  scaleExponent,
  minAuraReward,
  getBalances,
}: {
  id: MerkleDropId
  allocationKey: keyof AllocationProps
  totalAllocation: BigNumber
  allAccounts: Accounts
  scaleExponent: number
  minAuraReward: number
  getBalances(accounts: Accounts): Map<string, number>
}): Promise<MerkleDrop> => {
  const { allocations, accounts } = await getAllocations({
    id,
    allocationKey,
    totalAllocation,
    allAccounts,
    scaleExponent,
    minAuraReward,
    getBalances,
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
