import { BigNumber } from 'ethers'
import { Collection, Record } from 'immutable'
import { MerkleTree } from 'merkletreejs'
import {
  formatUnits,
  keccak256,
  parseUnits,
  solidityKeccak256,
} from 'ethers/lib/utils'

import { SCALE, ZERO } from './constants'
import { AllocationMap, Config, Network } from './types'

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
  const leaves = allocations
    .toArray()
    .map(([address, amount]) =>
      solidityKeccak256(['address', 'uint256'], [address, amount.toString()]),
    )
  return new MerkleTree(leaves, (data: string) => keccak256(data).slice(2), {
    sort: true,
  })
}

export const getCutoffBlock = (config: Config, network: Network) => {
  switch (network) {
    case 'arbitrum':
      return config.cutoffArbitrum
    case 'mainnet':
      return config.cutoffMainnet
    case 'polygon':
      return config.cutoffPolygon
  }
}

export const parseScientific = (num: string): string => {
  // If the number is not in scientific notation return it as it is.
  if (!/\d+\.?\d*e[+-]*\d+/i.test(num)) {
    return num
  }

  // Remove the sign.
  const numberSign = Math.sign(Number(num))
  num = Math.abs(Number(num)).toString()

  // Parse into coefficient and exponent.
  const [coefficient, exponent] = num.toLowerCase().split('e')
  let zeros = Math.abs(Number(exponent))
  const exponentSign = Math.sign(Number(exponent))
  const [integer, decimals] = (
    coefficient.indexOf('.') != -1 ? coefficient : `${coefficient}.`
  ).split('.')

  if (exponentSign === -1) {
    zeros -= integer.length
    num =
      zeros < 0
        ? integer.slice(0, zeros) + '.' + integer.slice(zeros) + decimals
        : '0.' + '0'.repeat(zeros) + integer + decimals
  } else {
    if (decimals) zeros -= decimals.length
    num =
      zeros < 0
        ? integer + decimals.slice(0, zeros) + '.' + decimals.slice(zeros)
        : integer + decimals + '0'.repeat(zeros)
  }

  return numberSign < 0 ? '-' + num : num
}
