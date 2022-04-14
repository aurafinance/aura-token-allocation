import chalk from 'chalk'
import { formatUnits } from 'ethers/lib/utils'

import { getFieldTotal } from '../utils'
import { SCALE } from '../constants'
import { AccountRecord } from '../Account'
import { PipelineArgs } from './types'

export const cullShrimp = (input: PipelineArgs): PipelineArgs => {
  console.info(chalk.grey('Culling shrimp...'))
  const accountsSizeBefore = input.accounts.size
  const totalAllocationBefore = getFieldTotal(input.accounts, [
    'allocation',
    input.allocationKey,
  ])

  const minAuraRewardExact = SCALE.mul(input.minAuraReward)
  const accounts = input.accounts.filter((account: AccountRecord) =>
    account.get('allocation').get(input.allocationKey).gte(minAuraRewardExact),
  )

  const totalAllocation = getFieldTotal(accounts, [
    'allocation',
    input.allocationKey,
  ])

  console.info(
    `Filtered out ${
      accountsSizeBefore - accounts.size
    } accounts under threshold: reallocating ${formatUnits(
      totalAllocationBefore.sub(totalAllocation),
    )} AURA`,
  )

  return { ...input, accounts }
}
