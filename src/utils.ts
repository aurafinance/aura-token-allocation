import { BigNumber } from 'ethers'
import { Collection, Record } from 'immutable'
import { MerkleTree } from 'merkletreejs'
import { sha256, soliditySha256 } from 'ethers/lib/utils'

import { SCALE, ZERO } from './constants'
import { AllocationMap } from './types'

export const mulTruncate = (bn: BigNumber, other: BigNumber) =>
  bn.mul(other).div(SCALE)

export const divPrecisely = (bn: BigNumber, other: BigNumber) =>
  bn.mul(SCALE).div(other)

export const getFieldTotal = <T extends object>(
  iter: Collection.Keyed<string, Record<T>>,
  field: keyof T,
): BigNumber =>
  iter.reduce(
    (prev, record) => prev.add(record.get(field) as unknown as BigNumber),
    ZERO,
  )

export const createMerkleTree = (allocations: AllocationMap): MerkleTree => {
  const hashFn = ([address, amount]) =>
    soliditySha256(['address', 'uint256'], [address, amount.toString()])
  const leaves = allocations.toArray().map(hashFn)
  return new MerkleTree(leaves, hashFn)
}
