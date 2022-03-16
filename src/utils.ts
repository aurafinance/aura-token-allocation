import { BigNumber } from 'ethers'
import { Collection, Record } from 'immutable'
import { MerkleTree } from 'merkletreejs'
import { formatUnits, parseUnits, soliditySha256 } from 'ethers/lib/utils'

import { SCALE, ZERO } from './constants'
import { AllocationMap } from './types'

export const mulTruncate = (bn: BigNumber, other: BigNumber) =>
  bn.mul(other).div(SCALE)

export const divPrecisely = (bn: BigNumber, other: BigNumber) =>
  bn.mul(SCALE).div(other)

export const parseBigDecimal = (bd: unknown) =>
  parseUnits(parseFloat(bd as string).toFixed(18))

export const exactToSimple = (bd: BigNumber): number =>
  parseFloat(formatUnits(bd))

export const getFieldTotal = <T extends object>(
  iter: Collection.Keyed<string, Record<T>>,
  keyPath: string[],
): BigNumber =>
  iter.reduce(
    (prev, record) => prev.add(record.getIn(keyPath) as unknown as BigNumber),
    ZERO,
  )

export const createMerkleTree = (allocations: AllocationMap): MerkleTree => {
  const hashFn = ([address, amount]) =>
    soliditySha256(['address', 'uint256'], [address, amount.toString()])
  const leaves = allocations.toArray().map(hashFn)
  return new MerkleTree(leaves, hashFn)
}
