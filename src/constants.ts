import { BigNumber } from 'ethers'

export const ZERO = BigNumber.from(0)

export const SCALE = BigNumber.from((1e18).toString())

export const MILLION = SCALE.mul(1e6)

// 100m
export const AURA_TOTAL_SUPPLY = BigNumber.from('100').mul(1e6)

// <$100 airdrop not viable on mainnet
export const AURA_BAG_NGMI_THRESHOLD = SCALE.mul(25)

export const GENESIS_CUTOFF_BLOCK_NUMBER = 14339625
