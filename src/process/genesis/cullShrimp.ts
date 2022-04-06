import chalk from 'chalk'
import { formatUnits } from 'ethers/lib/utils'

import { Accounts, Config, GenesisSpec } from '../../types'
import { getFieldTotal } from '../../utils'
import { SCALE } from '../../constants'
import { AccountRecord } from '../../Account'

export const cullShrimp = ({
  accounts,
  spec,
  config,
}: {
  accounts: Accounts
  spec: GenesisSpec
  config: Config
}) => {
  console.info(chalk.grey('Culling shrimp...'))
  const accountsSizeBefore = accounts.size
  const totalAllocationBefore = getFieldTotal(accounts, [
    'rescaledAllocation',
    'total',
  ])

  const minAuraRewardExact = SCALE.mul(config.minAuraReward)
  accounts = accounts.filter((account: AccountRecord) =>
    account.get('rescaledAllocation').get('total').gte(minAuraRewardExact),
  )

  const totalAllocation = getFieldTotal(accounts, [
    'rescaledAllocation',
    'total',
  ])

  console.info(
    `Filtered out ${
      accountsSizeBefore - accounts.size
    } accounts under threshold: reallocating ${formatUnits(
      totalAllocationBefore.sub(totalAllocation),
    )} AURA`,
  )

  return { accounts, spec, config }
}
