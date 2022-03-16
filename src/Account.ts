import { BigNumber, constants } from 'ethers'
import { Record, RecordOf } from 'immutable'

import { ZERO } from './constants'

export enum SnapshotVote {
  Yes,
  No,
  DidNotVote,
}

export interface AllocationProps {
  vlCVX: BigNumber
  BAL: BigNumber
  votingPower: BigNumber
  total: BigNumber
}

export interface AccountProps {
  address: string
  vote: SnapshotVote
  rawBalances: AllocationRecord
  rescaledAllocation: AllocationRecord
}

export type AccountRecord = RecordOf<AccountProps>

export type AllocationRecord = RecordOf<AllocationProps>

export const Allocation = Record<AllocationProps>({
  total: ZERO,
  vlCVX: ZERO,
  BAL: ZERO,
  votingPower: ZERO,
})

export const Account = Record<AccountProps>({
  address: constants.AddressZero,
  vote: SnapshotVote.DidNotVote,
  rawBalances: Allocation(),
  rescaledAllocation: Allocation(),
})
