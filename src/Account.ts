import { BigNumber, constants } from 'ethers'
import { Record, RecordOf } from 'immutable'

import { ZERO } from './constants'

export interface AllocationAmounts {
  vlCVX: BigNumber
  BAL: BigNumber
  veBAL?: BigNumber
}

export enum SnapshotVote {
  Yes,
  No,
  DidNotVote,
}

export interface AccountProps {
  address: string
  vlCVX: BigNumber
  BAL: BigNumber
  allocation: BigNumber
  vote: SnapshotVote
  votingPower: BigNumber
}

export type AccountRecord = RecordOf<AccountProps>

export const Account = Record<AccountProps>({
  address: constants.AddressZero,
  vlCVX: ZERO,
  BAL: ZERO,
  allocation: ZERO,
  vote: SnapshotVote.DidNotVote,
  votingPower: ZERO,
})
