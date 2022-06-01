import { BigNumber, constants } from 'ethers'
import { Record, RecordOf } from 'immutable'

import { ZERO } from './constants'

export enum SnapshotVote {
  DidNotVote,
  Yes,
  No,
}

export interface AllocationProps {
  convex: BigNumber
  balancer: BigNumber
  nfts: BigNumber
  merged: BigNumber
}

export interface AccountProps {
  address: string
  lobsterDao: number
  allocation: AllocationRecord
  BAL: BigNumber
  vlCVX: BigNumber
  votingPower: BigNumber
  vote: SnapshotVote
}

export type AccountRecord = RecordOf<AccountProps>

export type AllocationRecord = RecordOf<AllocationProps>

export const Allocation = Record<AllocationProps>({
  convex: ZERO,
  balancer: ZERO,
  nfts: ZERO,
  merged: ZERO,
})

export const Account = Record<AccountProps>({
  address: constants.AddressZero,
  allocation: Allocation(),
  lobsterDao: 0,
  BAL: BigNumber.from(0),
  vlCVX: BigNumber.from(0),
  votingPower: BigNumber.from(0),
  vote: SnapshotVote.DidNotVote,
})
