import { Accounts, GenesisSpec } from '../../types'
import { AccountProps } from '../../Account'
import { BigNumber } from 'ethers'
import { exactToSimple, parseBigDecimal } from '../../utils'
import { SCALE, ZERO } from '../../constants'
import { scaleSqrt } from 'd3-scale'
import { formatUnits } from 'ethers/lib/utils'
import { Map } from 'immutable'

export const rescaleAccounts = (accounts: Accounts, spec: GenesisSpec) => {
  const getScaledValues = (key: keyof AccountProps, allocation: BigNumber) => {
    const valuesSimple = accounts.map((account) =>
      exactToSimple(account.get(key, ZERO) as BigNumber),
    )

    // Get the highest value entry
    const maxEntry = valuesSimple
      .entrySeq()
      .max(([, a], [, b]) => (a > b ? 1 : -1))
    const [maxAddr, maxValue] = maxEntry

    // Create sqrt distribution: mapping values to 0-1
    const scale = scaleSqrt().domain([0, maxValue]).range([0, 1]).clamp(true)
    const sqrtValuesSimple = valuesSimple.map(scale)

    // Scale the values by the sqrt distribution
    const scaledValuesSimple = sqrtValuesSimple.map(
      (value, address) => value * valuesSimple.get(address, 0),
    )

    // Total the scaled values and get the share of the allocation
    const scaledValuesTotal = scaledValuesSimple
      .valueSeq()
      .reduce((prev, value) => prev + value, 0)
    const allocationPerScaledValue =
      exactToSimple(allocation) / scaledValuesTotal

    // Rescale the scaled values by the share of the allocation
    const rescaledValues = scaledValuesSimple.map(
      (value) => allocationPerScaledValue * value,
    )
    let rescaledValuesExact = rescaledValues.map(parseBigDecimal)

    // Since we lost precision, handle any dust that accrued (can be ±total)
    const dust = allocation.sub(
      rescaledValuesExact.reduce((prev, value) => prev.add(value), ZERO),
    )
    if (dust.gt(SCALE)) {
      throw new Error(`Too much dust for ${key}: ${formatUnits(dust.abs())}`)
    } else {
      // Allocate dust to/from the largest recipient
      console.info(
        `Handling ${formatUnits(dust.abs())} dust for ${key} for ${maxAddr}`,
      )
      rescaledValuesExact = rescaledValuesExact.update(maxAddr, (value) =>
        dust.gt(0) ? value.add(dust) : value.sub(dust),
      )
    }

    return rescaledValuesExact
  }

  // Rescale into separate account/allocation maps
  const rescaledAllocations = Map<keyof AccountProps, Map<string, BigNumber>>(
    (
      [
        ['vlCVX', spec.groups.vlCVX],
        ['BAL', spec.groups.BAL],
        ['votingPower', spec.groups.yesVote],
      ] as [keyof AccountProps, BigNumber][]
    ).map(([key, allocation]) => [key, getScaledValues(key, allocation)]),
  )

  return accounts.map((account) => {
    // Add up all the rescaled allocations for this account
    const allocation = rescaledAllocations
      .valueSeq()
      .reduce(
        (prev, map) => prev.add(map.get(account.get('address'), ZERO)),
        ZERO,
      )
    return account.set('allocation', allocation)
  })
}
