import { scalePow } from 'd3-scale'
import { formatUnits } from 'ethers/lib/utils'

import { Account, Allocation } from '../Account'
import { exactToSimple, parseBigDecimal } from '../utils'
import { SCALE, ZERO } from '../constants'
import { PipelineArgs } from './types'

export const rescale = (input: PipelineArgs): PipelineArgs => {
  const rescaledValues = (() => {
    const unscaledBalances = input.getBalances(input.accounts)

    const allocation = exactToSimple(input.totalAllocation)

    // Get the highest value entry
    const maxEntry = unscaledBalances
      .entrySeq()
      .max(([, a], [, b]) => (a > b ? 1 : -1))
    const [maxAddr, maxValue] = maxEntry

    // Power distribution
    const scale = scalePow().exponent(input.scaleExponent).domain([0, maxValue])

    // Values from 0-1
    const multipliers = unscaledBalances.map(scale)

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
    const dust = input.totalAllocation.sub(totalRescaledValues)
    if (dust.gt(SCALE)) {
      throw new Error(
        `Too much dust for ${input.allocationKey}: ${formatUnits(dust.abs())}`,
      )
    } else {
      // Allocate dust to/from the largest recipient
      rescaledValues = rescaledValues.update(maxAddr, (value) =>
        dust.gt(0) ? value.add(dust) : value.sub(dust),
      )
    }

    return rescaledValues
  })()

  // Update the accounts (set allocation and rescaled balances)
  const accounts = input.accounts.map((account) => {
    const address = account.get('address')

    // Set the new allocations
    const allocation = Allocation({
      [input.allocationKey]: rescaledValues.get(address),
    })

    return Account({
      address,
      allocation,
      vote: account.get('vote'),
      BAL: account.get('BAL'),
      vlCVX: account.get('vlCVX'),
      votingPower: account.get('votingPower'),
    })
  })

  return { ...input, accounts }
}
