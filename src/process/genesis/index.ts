import { BigNumber } from 'ethers'

import {
  Config,
  Data,
  GenesisSpec,
  MerkleDrop,
  MerkleDropSpec,
} from '../../types'
import { ZERO } from '../../constants'
import { createMerkleTree } from '../../utils'
import { getAllocations } from './getAllocations'

const getSpecAllocation = (spec: MerkleDropSpec): BigNumber =>
  Object.values(spec.groups).reduce((prev, amount) => prev.add(amount), ZERO)

export const createGenesisDrop = async (
  data: Data,
  spec: GenesisSpec,
  config: Config,
): Promise<MerkleDrop> => {
  const { allocations, accounts } = await getAllocations(data, spec, config)

  const merkleTree = createMerkleTree(allocations)

  const specAllocation = getSpecAllocation(spec)
  const totalAllocation = allocations.reduce(
    (prev, allocation) => prev.add(allocation),
    ZERO,
  )
  const totalDust = specAllocation.sub(totalAllocation)

  return {
    spec,
    merkleTree,
    accounts,
    allocations,
    totalAllocation,
    totalDust,
  }
}
