import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

import { SCALE, ZERO } from '../constants'
import { mulTruncate } from '../utils'
import { PipelineArgs } from './types'
import { Account } from '../Account'
import { logger } from '../logger'

export const applyRedirections = (input: PipelineArgs): PipelineArgs => {
  const { accounts, allocationKey, redirections } = input

  if (!['balancer', 'convex'].includes(allocationKey)) {
    return input
  }

  const balanceKey = input.allocationKey === 'balancer' ? 'BAL' : 'vlCVX'

  logger.info(`Applying redirections for ${balanceKey}`)

  // Iterate over redirections
  // Update allocations for source/dest
  // Handle single redirects and redirect shares
  return {
    ...input,
    accounts: accounts.withMutations((mutable) => {
      redirections
        .flatMap((redirection) => Object.entries(redirection))
        .forEach(([source, dest]) => {
          const sourceAmount = mutable.getIn([source, balanceKey]) as
            | BigNumber
            | undefined

          if (!sourceAmount || sourceAmount.eq(0)) {
            return
          }

          // XXX: Only map/set work in withMutations; otherwise we would updateIn

          // Remove the amount from source
          mutable.set(source, mutable.get(source).set(balanceKey, ZERO))

          if (typeof dest === 'string') {
            logger.info(`${source} => ${dest}`)
            // Add the full amount to dest
            mutable.set(
              dest,
              mutable
                .get(dest, Account({ address: dest }))
                .update(balanceKey, (amount = ZERO) =>
                  amount.add(sourceAmount),
                ),
            )
          } else {
            // Iterate through shares and add the calculated amount to final destinations
            logger.info(`${source} => ${Object.keys(dest).length} accounts`)

            const entries: [string, BigNumber][] = Object.entries(dest).map(
              ([finalDest, share]) => [
                finalDest,
                parseUnits(share.slice(0, 20)),
              ],
            )

            entries.forEach(([finalDest, share], index) => {
              mutable.set(
                finalDest,
                mutable
                  .get(finalDest, Account({ address: finalDest }))
                  .update(balanceKey, (amount = ZERO) => {
                    const addition = mulTruncate(sourceAmount, share)
                    return amount.add(addition)
                  }),
              )
            })

            // Add the remainder to the first entry
            // Already verified that shares total <= 1, so we can safely get the remainder
            const remainder = entries.reduce(
              (prev, [, share]) => prev.sub(share),
              SCALE,
            )
            const first = entries[0][0]
            mutable.set(
              first,
              mutable.get(first).update(balanceKey, (amount) => {
                const addition = mulTruncate(sourceAmount, remainder)
                logger.info(
                  `Adding remainder of ${formatUnits(addition)} to ${first}`,
                )
                return amount.add(addition)
              }),
            )
          }
        })
    }),
  }
}
