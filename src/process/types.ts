import { Accounts, MerkleDropId } from '../types'
import { AllocationProps } from '../Account'
import { BigNumber } from 'ethers'
import { Map } from 'immutable'

export interface Redirection {
  [address: string]: string | { [address: string]: string }
}

export interface PipelineArgs {
  id: MerkleDropId
  allocationKey: keyof AllocationProps
  totalAllocation: BigNumber
  scaleExponent?: number
  accounts: Accounts
  minAuraReward?: number
  getBalances(accounts: Accounts): Map<string, number>
  redirections: Redirection[]
}
