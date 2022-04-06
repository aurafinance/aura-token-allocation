import { BigNumber } from 'ethers'
import { scalePow } from 'd3-scale'
import { formatUnits } from 'ethers/lib/utils'
import { Map } from 'immutable'

import { Accounts, Config, GenesisSpec } from '../../types'
import { Account, Allocation, AllocationProps } from '../../Account'
import { exactToSimple, parseBigDecimal } from '../../utils'
import { SCALE, ZERO } from '../../constants'

export const rescale = ({
  accounts,
  spec,
  config,
}: {
  accounts: Accounts
  spec: GenesisSpec
  config: Config
}) => {
  const getScaledValues = (
    key: keyof AllocationProps,
    allocationExact: BigNumber,
    scaleExponent: number,
  ) => {
    const allocation = exactToSimple(allocationExact)

    const rawBalances = accounts.map((account) =>
      exactToSimple((account.getIn(['rawBalances', key]) ?? ZERO) as BigNumber),
    )

    // Get the highest value entry
    const maxEntry = rawBalances
      .entrySeq()
      .max(([, a], [, b]) => (a > b ? 1 : -1))
    const [maxAddr, maxValue] = maxEntry

    // Power distribution
    const scale = scalePow().exponent(scaleExponent).domain([0, maxValue])

    // Values from 0-1
    const multipliers = rawBalances.map(scale)

    const totalMultipliers = multipliers.reduce(
      (prev, value) => prev + value,
      0,
    )
    const allocationShare = allocation / totalMultipliers

    // Rescale the values by the share of the allocation
    let rescaledValues = multipliers.map((value) =>
      parseBigDecimal(allocationShare * value),
    )

    // Since we lost precision, handle any dust that accrued (can be ±total)
    const totalRescaledValues = rescaledValues.reduce(
      (prev, value) => prev.add(value),
      ZERO,
    )
    const dust = allocationExact.sub(totalRescaledValues)
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
        ['vlCVX', spec.groups.vlCVX, config.scaleExponentVlcvx],
        ['BAL', spec.groups.BAL, config.scaleExponentBal],
        ['votingPower', spec.groups.yesVote, config.scaleExponentVote],
      ] as [keyof AllocationProps, BigNumber, number][]
    ).map(([key, groupAllocation, scaleExponent]) => [
      key,
      getScaledValues(key, groupAllocation, scaleExponent),
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

  return { accounts: rescaledAccounts, spec, config }
}
