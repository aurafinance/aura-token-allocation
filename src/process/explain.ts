import { BigNumber, BigNumberish } from 'ethers'
import chalk from 'chalk'
import gini from 'gini'
import hsl2rgb from 'hsl-to-rgb-for-reals'

import { exactToSimple } from '../utils'
import { ZERO } from '../constants'
import { PipelineArgs } from './types'
import { SnapshotVote } from '../Account'
import { logger } from '../logger'

export const explain =
  (description: string) =>
  (input: PipelineArgs): PipelineArgs => {
    logger.info('-'.repeat(80))
    logger.info(`${input.id} ${description}`)

    const getGiniCoeff = (keyPath: string[]) => {
      const values = input.accounts
        .map((account) =>
          exactToSimple((account.getIn(keyPath) as BigNumber) ?? ZERO),
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
        logger.info(
          `${keyPath.join('.')}: ${chalk.rgb(
            ...(highlight as [number, number, number]),
          )(giniCoeff.toFixed(2))}`,
        )
      }
    }

    const balanceKey =
      input.allocationKey === 'balancer'
        ? 'BAL'
        : input.allocationKey === 'nfts'
        ? 'nfts'
        : 'vlCVX'

    if (balanceKey !== 'nfts') {
      logger.info('Gini coefficients (weighted)')
      logGiniCoeff([balanceKey])
      logGiniCoeff(['allocation', input.allocationKey])
    }

    const getTotal = (key: string) =>
      input.accounts.reduce(
        (prev, account) => prev.add(account.get(key, 0) as BigNumberish),
        BigNumber.from(0),
      )

    const getRecipients = (key: string) =>
      input.accounts.filter((account) =>
        (
          (account.getIn(['allocation', key]) as BigNumber) ?? BigNumber.from(0)
        ).gt(0),
      ).size

    const totalToken = getTotal(balanceKey)
    const totalRecipients = getRecipients(input.allocationKey)
    if (totalRecipients) {
      logger.info(
        `Total ${balanceKey}: ${(
          parseInt(totalToken.toString()) / 1e18
        ).toFixed(2)}`,
      )

      if (input.allocationKey === 'balancer') {
        const yesVoters = input.accounts.filter(
          (account) => account.get('vote') === SnapshotVote.Yes,
        )
        logger.info(`Balancer Yes-voters: ${yesVoters.size}`)

        const yesVotersWithAlloc = yesVoters.filter((account) =>
          (
            (account.getIn(['allocation', input.allocationKey]) as BigNumber) ??
            BigNumber.from(0)
          ).gt(0),
        )
        logger.info(
          `Users getting Yes-vote bonuses: ${yesVotersWithAlloc.size}`,
        )
      }

      logger.info(`Holders with ${input.id} claims: ${totalRecipients}`)
    }

    return input
  }
