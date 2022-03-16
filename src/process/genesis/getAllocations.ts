import { formatUnits } from 'ethers/lib/utils'
import { OrderedMap } from 'immutable'
import { BigNumber } from 'ethers'
import { pipeline } from 'ts-pipe-compose'
import gini from 'gini'
import hsl2rgb from 'hsl-to-rgb-for-reals'
import chalk from 'chalk'

import { Accounts, AllocationMap, Data, GenesisSpec } from '../../types'
import { getAccounts } from './getAccounts'
import { rescale } from './rescale'
import { exactToSimple, getFieldTotal } from '../../utils'
import { AccountRecord } from '../../Account'
import { AURA_BAG_NGMI_THRESHOLD, ZERO } from '../../constants'

const cullShrimp = ({
  accounts,
  spec,
}: {
  accounts: Accounts
  spec: GenesisSpec
}) => {
  console.info(chalk.grey('Culling shrimp...'))
  const accountsSizeBefore = accounts.size
  const totalAllocationBefore = getFieldTotal(accounts, [
    'rescaledAllocation',
    'total',
  ])

  accounts = accounts.filter((account: AccountRecord) =>
    account.get('rescaledAllocation').get('total').gte(AURA_BAG_NGMI_THRESHOLD),
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

  return { accounts, spec }
}

const explain = (input: { accounts: Accounts; spec: GenesisSpec }) => {
  const getGiniCoeff = (keyPath: string[]) => {
    const values = input.accounts
      .map(
        (account) => exactToSimple(account.getIn(keyPath) as BigNumber) ?? ZERO,
      )
      .valueSeq()
      .filter((v) => v > 0)
      .sort()
      .toArray()

    if (!values.length) return null

    return gini.ordered(values)
  }

  const logGiniCoeff = (keyPath: string[]) => {
    const giniCoeff = getGiniCoeff(keyPath)
    if (giniCoeff) {
      const highlight = hsl2rgb(-1 * (giniCoeff * 100) + 100, 1, 0.3)
      console.info(
        `${keyPath.join('.')}: ${chalk.rgb(
          ...(highlight as [number, number, number]),
        )(giniCoeff.toFixed(2))}`,
      )
    }
  }

  console.info(chalk.grey('Gini coefficients (raw)'))
  logGiniCoeff(['rawBalances', 'vlCVX'])
  logGiniCoeff(['rawBalances', 'BAL'])
  logGiniCoeff(['rawBalances', 'votingPower'])
  console.info(chalk.grey('Gini coefficients (weighted)'))
  logGiniCoeff(['rescaledAllocation', 'vlCVX'])
  logGiniCoeff(['rescaledAllocation', 'BAL'])
  logGiniCoeff(['rescaledAllocation', 'votingPower'])
  logGiniCoeff(['rescaledAllocation', 'total'])

  return input
}

export const getAllocations = (
  data: Data,
  spec: GenesisSpec,
): {
  allocations: AllocationMap
  accounts: Accounts
} => {
  const accounts = pipeline(
    () => ({ accounts: getAccounts(data), spec }),
    explain,
    rescale,
    explain,
    cullShrimp,
    explain,
    rescale,
    explain,
    (result) => result.accounts,
  )()

  const allocations: AllocationMap = OrderedMap(
    accounts
      .map<BigNumber>((account) =>
        account.get('rescaledAllocation').get('total', ZERO),
      )
      .toOrderedMap()
      .sort((a, b) => (a.gt(b) ? -1 : 1)),
  )

  return { allocations, accounts }
}
