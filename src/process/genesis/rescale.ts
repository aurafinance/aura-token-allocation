import { BigNumber } from 'ethers'
import { scaleSqrt } from 'd3-scale'
import { formatUnits } from 'ethers/lib/utils'
import { Map } from 'immutable'
import chalk from 'chalk'

import { Accounts, GenesisSpec } from '../../types'
import { Account, Allocation, AllocationProps } from '../../Account'
import { exactToSimple, parseBigDecimal } from '../../utils'
import { SCALE, ZERO } from '../../constants'

export const rescale = ({
  accounts,
  spec,
}: {
  accounts: Accounts
  spec: GenesisSpec
}) => {
  console.info(chalk.grey('Rescaling...'))
  const getScaledValues = (
    key: keyof AllocationProps,
    allocation: BigNumber,
  ) => {
    const values = accounts.map((account) =>
      exactToSimple((account.getIn(['rawBalances', key]) ?? ZERO) as BigNumber),
    )

    // Get the highest value entry
    const maxEntry = values.entrySeq().max(([, a], [, b]) => (a > b ? 1 : -1))
    const [maxAddr, maxValue] = maxEntry

    // Square root distribution
    const scale = scaleSqrt().domain([0, maxValue])
    const sqrtValues = values.map(scale)

    // Total the scaled values and get the share of the allocation
    const total = sqrtValues.reduce((prev, value) => prev + value, 0)
    if (total === 0) {
      throw new Error(`div(0) for ${key} total`)
    }
    const allocationShare = exactToSimple(allocation) / total

    // Rescale the values by the share of the allocation
    let rescaledValues = sqrtValues.map((value) =>
      parseBigDecimal(allocationShare * value),
    )

    // Since we lost precision, handle any dust that accrued (can be ±total)
    const dust = allocation.sub(
      rescaledValues.reduce((prev, value) => prev.add(value), ZERO),
    )
    if (dust.gt(SCALE)) {
      throw new Error(`Too much dust for ${key}: ${formatUnits(dust.abs())}`)
    } else {
      // Allocate dust to/from the largest recipient
      rescaledValues = rescaledValues.update(maxAddr, (value) =>
        dust.gt(0) ? value.add(dust) : value.sub(dust),
      )
    }

    return rescaledValues
  }

  // Rescale into separate account/balance maps
  const rescaledBalances = Map<keyof AllocationProps, Map<string, BigNumber>>(
    (
      [
        ['vlCVX', spec.groups.vlCVX],
        ['BAL', spec.groups.BAL],
        ['votingPower', spec.groups.yesVote],
      ] as [keyof AllocationProps, BigNumber][]
    ).map(([key, groupAllocation]) => [
      key,
      getScaledValues(key, groupAllocation),
    ]),
  )

  // Update the accounts (set allocation and rescaled balances)
  const rescaledAccounts = accounts.map((account) => {
    const address = account.get('address')

    // Add up all the allocations for this account
    const rescaledTotal = rescaledBalances
      .valueSeq()
      .reduce((prev, map) => prev.add(map.get(address, ZERO)), ZERO)

    // Set the new allocations
    const rescaledAllocation = Allocation({
      ...(rescaledBalances
        .map((map) => map.get(address))
        .toJS() as {} as AllocationProps),
      total: rescaledTotal,
    })

    return Account({
      address,
      vote: account.get('vote'),
      rawBalances: account.get('rawBalances'),
      rescaledAllocation,
    })
  })

  return { accounts: rescaledAccounts, spec }
}
