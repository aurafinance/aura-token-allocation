import { config as dotenvConfig } from 'dotenv'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { fetchData } from './fetch'
import { createMerkleDrops } from './process'
import { Config } from './types'

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
      default: 14577822,
      type: 'number',
      describe: 'Snapshot cutoff block for Mainnet',
    },
    cutoffPolygon: {
      default: 27092000,
      type: 'number',
      describe: 'Snapshot cutoff block for Polygon',
    },
    cutoffArbitrum: {
      default: 9751000,
      type: 'number',
      describe: 'Snapshot cutoff block for Arbitrum',
    },
    minAuraRewardBalancer: {
      default: 25,
      type: 'number',
      describe: 'Minimum reward size in AURA for the Balancer Merkle drop',
    },
    minAuraRewardConvex: {
      default: 25,
      type: 'number',
      describe: 'Minimum reward size in AURA for the Convex Merkle drop',
    },
    balancerVoteProposalId: {
      type: 'string',
      default:
        '0xe8c75512fad1ae00352d70da8572b2184e430d9fbfd1e77369ddc3639bc22695',
      describe: 'Proposal ID from Snapshot used for the Balancer vote query',
    },
    balancerVoteMultiplier: {
      type: 'number',
      default: 1.5,
      describe: 'Balance multiplier given to yes voters',
    },
  }).argv

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
