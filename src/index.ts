import { config as dotenvConfig } from 'dotenv'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { fetchData } from './fetch'
import { createMerkleDrop } from './process'
import { MILLION, SCALE } from './constants'
import { Config, GenesisSpec, MerkleDropId } from './types'
import { divPrecisely } from './utils'

dotenvConfig()

const main = async () => {
  const genesisSpec: GenesisSpec = {
    id: MerkleDropId.GENESIS,
    groups: {
      vlCVX: MILLION,
      BAL: MILLION,
      yesVote: divPrecisely(MILLION, SCALE.mul(2)),
    },
  }

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
    scaleExponentVote: {
      default: 0.4,
      type: 'number',
      describe: 'Exponent used to rescale allocations (Vote)',
    },
    cutoffMainnet: {
      default: 14474050,
      type: 'number',
      describe: 'Snapshot cutoff block for Mainnet',
    },
    cutoffPolygon: {
      default: 25900796,
      type: 'number',
      describe: 'Snapshot cutoff block for Polygon',
    },
    cutoffArbitrum: {
      default: 7844323,
      type: 'number',
      describe: 'Snapshot cutoff block for Arbitrum',
    },
    minAuraReward: {
      default: 30,
      type: 'number',
      describe: 'Minimum reward size in $AURA',
    },
    balancerVoteProposalId: {
      type: 'string',
      default:
        '0xf9e44f6659b0a3a3249341bf8588b192ab923374fbca3f9be929c156036565e7',
      describe: 'Proposal ID from Snapshot used for the Balancer vote query',
    },
  }).argv

  const data = await fetchData(config)
  await createMerkleDrop(data, genesisSpec, config)
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
