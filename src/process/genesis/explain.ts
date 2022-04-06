import { BigNumber } from 'ethers'
import chalk from 'chalk'
import gini from 'gini'
import hsl2rgb from 'hsl-to-rgb-for-reals'
import { Accounts, Config, GenesisSpec } from '../../types'
import { exactToSimple } from '../../utils'
import { ZERO } from '../../constants'

export const explain =
  (description: string) =>
  (input: { accounts: Accounts; spec: GenesisSpec; config: Config }) => {
    console.log('-'.repeat(80))
    console.log(chalk.yellow(description))

    const getGiniCoeff = (keyPath: string[]) => {
      const values = input.accounts
        .map(
          (account) =>
            exactToSimple(account.getIn(keyPath) as BigNumber) ?? ZERO,
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

    const getTotal = (key: string) =>
      input.accounts.reduce(
        (prev, account) =>
          prev.add((account.getIn(['rawBalances', key]) as BigNumber) ?? 0),
        BigNumber.from(0),
      )

    const getRecipients = (key: string) =>
      input.accounts.filter((account) =>
        (
          (account.getIn(['rescaledAllocation', key]) as BigNumber) ??
          BigNumber.from(0)
        ).gt(0),
      ).size

    const logAllocation = (key: string) => {
      const totalToken = getTotal(key)
      const totalRecipients = getRecipients(key)
      if (totalRecipients) {
        console.log(
          `Total ${key}: ${chalk.blueBright(
            (parseInt(totalToken.toString()) / 1e18).toFixed(2),
          )}`,
        )
        console.log(
          `Holders with ${key} claims: ${chalk.blueBright(totalRecipients)}`,
        )
      }
    }

    ;['BAL', 'vlCVX', 'votingPower'].forEach(logAllocation)

    return input
  }
