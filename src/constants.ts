import { BigNumber } from 'ethers'

export const ZERO = BigNumber.from(0)

export const SCALE = BigNumber.from((1e18).toString())

export const MILLION = SCALE.mul(1e6)

// 100m
export const AURA_TOTAL_SUPPLY = BigNumber.from('100').mul(1e6)

export const BAL = {
  mainnet: '0xba100000625a3754423978a60c9317c58a424e3d',
  polygon: '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3',
  arbitrum: '0x040d1edc9569d4bab2d15287dc5a4f10f56a56b8',
}
