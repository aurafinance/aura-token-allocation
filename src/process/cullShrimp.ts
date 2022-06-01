import { formatUnits } from 'ethers/lib/utils'

import { getFieldTotal } from '../utils'
import { SCALE } from '../constants'
import { AccountRecord } from '../Account'
import { PipelineArgs } from './types'
import { logger } from '../logger'

export const cullShrimp = (input: PipelineArgs): PipelineArgs => {
  logger.info('Culling shrimp...')
  const accountsSizeBefore = input.accounts.size
  const totalAllocationBefore = getFieldTotal(input.accounts, [
    'allocation',
    input.allocationKey,
  ])

  let accounts = input.accounts

  if (input.minAuraReward) {
    const minAuraRewardExact = SCALE.mul(input.minAuraReward)
    accounts = input.accounts.filter((account: AccountRecord) =>
      account
        .get('allocation')
        .get(input.allocationKey)
        .gte(minAuraRewardExact),
    )
  }

  const totalAllocation = getFieldTotal(accounts, [
    'allocation',
    input.allocationKey,
  ])

  logger.info(
    `Filtered out ${
      accountsSizeBefore - accounts.size
    } accounts under threshold: reallocating ${formatUnits(
      totalAllocationBefore.sub(totalAllocation),
    )} AURA`,
  )

  return { ...input, accounts }
}
