import fg from 'fast-glob'
import fs from 'fs'
import { Validator } from 'jsonschema'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'

import redirectionSchema from '../../redirection/redirection.schema.json'
import { Redirection } from './types'
import { ZERO } from '../constants'
import { parseScientific } from '../utils'
import { logger } from '../logger'

export const getRedirections = async (): Promise<Redirection[]> => {
  const paths = await fg([
    './redirection/*.json',
    '!./redirection/redirection.schema.json',
  ])
  const files = await Promise.all(
    paths.map((path) => fs.promises.readFile(path, 'utf-8')),
  )

  const validator = new Validator()

  const sourcesSpecified = new Set<string | undefined>()

  return files.map((file, index) => {
    const json = JSON.parse(file) as Redirection

    const validatorResult = validator.validate(json, redirectionSchema)

    if (!validatorResult.valid) {
      logger.error(`Invalid redirection file ${paths[index]}`)
      logger.error(validatorResult.errors)
      throw new Error('Redirection validation failed')
    }

    // Sanitise before more validation
    const redirection = Object.fromEntries(
      Object.entries(json).map(([source, dest]) => [
        source.toLowerCase(),
        typeof dest === 'string'
          ? dest.toLowerCase()
          : Object.fromEntries(
              Object.entries(dest)
                .filter(([, amount]) => {
                  return parseFloat(amount) > 0
                })
                .map(([finalDest, share]) => [finalDest.toLowerCase(), share]),
            ),
      ]),
    ) as Redirection

    // Validate destinations
    for (const [source, dest] of Object.entries(redirection)) {
      // Validate that sources are not specified more than once
      if (sourcesSpecified.has(source)) {
        logger.error(`Duplicate source found: ${paths[index]}: ${source}`)
        throw new Error('Redirection validation failed')
      }
      sourcesSpecified.add(source)

      if (typeof dest === 'string') {
        // No extra validation needed for single redirects
        continue
      }

      // Get max decimals used in amounts
      const decimals = Math.max(
        ...Object.values(dest).map(
          (amount) =>
            parseScientific(amount.toString()).split('.')[1]?.length ?? 0,
        ),
      )

      const scale = BigNumber.from(10).pow(decimals)

      // Get scaled shares total
      const total = Object.values(dest).reduce((prev, amount) => {
        const formatted = parseScientific(amount.toString())
        const scaledAmount = parseUnits(formatted, decimals)
        return prev.add(scaledAmount)
      }, ZERO)

      // Check total against scale; can't be over scale
      const remainder = total.sub(scale)
      if (!remainder.eq(0)) {
        logger.warn(
          `Redirection destination total mismatch ${paths[index]}: ${source}: ${
            remainder.gt(0)
              ? `${remainder.toString()} (${formatUnits(
                  remainder.abs(),
                  decimals,
                )}) excess allocation!`
              : `${remainder.abs().toString()} (${formatUnits(
                  remainder.abs(),
                  decimals,
                )}) not allocated`
          }`,
        )
        if (remainder.gt(0)) {
          throw new Error('Redirection validation failed')
        }
      }
    }
    return redirection
  })
}
