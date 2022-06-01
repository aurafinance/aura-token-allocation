import { config as dotenvConfig } from 'dotenv'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { fetchData } from './fetch'
import { createMerkleDrops } from './process'
import { Config } from './types'
import { logger } from './logger'

dotenvConfig()

const main = async () => {
  const config: Config = await yargs(hideBin(process.argv)).options({
    cache: {
      type: 'boolean',
      default: true,
      describe: 'Whether to use cached query results',
    },
    scaleExponentBal: {
      default: 0.75,
      type: 'number',
      describe: 'Exponent used to rescale allocations (BAL)',
    },
    scaleExponentVlcvx: {
      default: 0.75,
      type: 'number',
      describe: 'Exponent used to rescale allocations (vlCVX)',
    },
    cutoffMainnet: {
      default: 14829454,
      type: 'number',
      describe: 'Snapshot cutoff block for Mainnet',
    },
    cutoffPolygon: {
      default: 28669903,
      type: 'number',
      describe: 'Snapshot cutoff block for Polygon',
    },
    cutoffArbitrum: {
      default: 12779734,
      type: 'number',
      describe: 'Snapshot cutoff block for Arbitrum',
    },
    minAuraRewardBalancer: {
      default: 50,
      type: 'number',
      describe: 'Minimum reward size in AURA for the Balancer Merkle drop',
    },
    minAuraRewardConvex: {
      default: 50,
      type: 'number',
      describe: 'Minimum reward size in AURA for the Convex Merkle drop',
    },
    balancerVoteProposalId: {
      type: 'string',
      default:
        '0xb8c3a2e527e9e502055926a3bc646874207e46c8985f9e6317c331338da70711',
      describe: 'Proposal ID from Snapshot used for the Balancer vote query',
    },
    balancerVoteMultiplier: {
      type: 'number',
      default: 3,
      describe: 'Balance multiplier given to yes voters',
    },
  }).argv

  const {
    scaleExponentBal,
    scaleExponentVlcvx,
    cutoffMainnet,
    cutoffPolygon,
    cutoffArbitrum,
    minAuraRewardBalancer,
    minAuraRewardConvex,
    balancerVoteProposalId,
    balancerVoteMultiplier,
  } = config
  logger.info('Config', {
    scaleExponentBal,
    scaleExponentVlcvx,
    cutoffMainnet,
    cutoffPolygon,
    cutoffArbitrum,
    minAuraRewardBalancer,
    minAuraRewardConvex,
    balancerVoteProposalId,
    balancerVoteMultiplier,
  })

  const data = await fetchData(config)
  await createMerkleDrops(data, config)
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
