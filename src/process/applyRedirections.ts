import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

import { SCALE, ZERO } from '../constants'
import { mulTruncate } from '../utils'
import { PipelineArgs } from './types'
import {
  Account,
  AccountProps,
  AllocationProps,
  SnapshotVote,
} from '../Account'
import { logger } from '../logger'

const allocationKeyRemapping: Record<
  keyof AllocationProps,
  {
    balances: (keyof AccountProps)[]
    vote?: boolean
    lobsterDao?: boolean
  }
> = {
  balancer: { balances: ['BAL', 'votingPower'], vote: true },
  convex: { balances: ['vlCVX'] },
  nfts: { balances: [], lobsterDao: true },
  merged: { balances: [] },
}

export const applyRedirections = (input: PipelineArgs): PipelineArgs => {
  const { accounts, allocationKey, redirections } = input

  logger.info(`Applying redirections for ${allocationKey}`)

  const remapping = allocationKeyRemapping[allocationKey]

  // Iterate over redirections
  // Update allocations for source/dest
  // Handle single redirects and redirect shares
  return {
    ...input,
    accounts: accounts.withMutations((mutable) => {
      for (const [source, dest] of redirections.flatMap((redirection) =>
        Object.entries(redirection),
      )) {
        if (remapping.vote) {
          // Can't remap a vote to shares
          if (typeof dest !== 'string') {
            continue
          }

          const sourceVote = mutable
            .get(source, Account({ address: source }))
            .get('vote')

          const destVote = mutable
            .get(dest, Account({ address: dest }))
            .get('vote')

          if (destVote === SnapshotVote.Yes) {
            // Don't overwrite a yes vote
            continue
          }

          // Unset source vote
          mutable.set(
            source,
            mutable
              .get(source, Account({ address: source }))
              .set('vote', SnapshotVote.DidNotVote),
          )

          // Set dest vote
          logger.info(`Redirect vote: ${source} => ${dest}, ${sourceVote}`)
          mutable.set(
            dest,
            mutable
              .get(dest, Account({ address: dest }))
              .set('vote', sourceVote),
          )
        }

        if (remapping.lobsterDao) {
          const sourceLobsterDao = mutable
            .get(source, Account({ address: source }))
            .get('lobsterDao')

          // Can't remap a lobster to shares
          if (typeof dest !== 'string' || sourceLobsterDao === 0) {
            continue
          }

          mutable.set(
            source,
            mutable
              .get(source, Account({ address: source }))
              .set('lobsterDao', 0),
          )

          logger.info(
            `Redirect lobsterDao: ${source} => ${dest}, ${sourceLobsterDao}`,
          )
          mutable.set(
            dest,
            mutable
              .get(dest, Account({ address: dest }))
              .update(
                'lobsterDao',
                (amount = 0) => (amount as number) + sourceLobsterDao,
              ),
          )
        }

        for (const balanceKey of remapping.balances) {
          const sourceAmount = mutable.getIn([source, balanceKey]) as
            | BigNumber
            | undefined

          if (!sourceAmount || sourceAmount.eq(0)) {
            continue
          }

          // Remove the amount from source
          mutable.set(source, mutable.get(source).set(balanceKey, ZERO))

          if (typeof dest === 'string') {
            logger.info(
              `Redirect ${balanceKey}: ${source} => ${dest}, ${formatUnits(
                sourceAmount,
              )}`,
            )
            // Add the full amount to dest
            mutable.set(
              dest,
              mutable
                .get(dest, Account({ address: dest }))
                .update(balanceKey, (amount = ZERO) =>
                  (amount as BigNumber).add(sourceAmount),
                ),
            )
          } else {
            // Iterate through shares and add the calculated amount to final destinations
            logger.info(
              `Redirect ${balanceKey}: ${source} => ${
                Object.keys(dest).length
              } accounts`,
            )

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
                    return (amount as BigNumber).add(addition)
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
                return (amount as BigNumber).add(addition)
              }),
            )
          }
        }
      }
    }),
  }
}
