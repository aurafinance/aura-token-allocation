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
    scaleExponent: {
      default: 0.75,
      type: 'number',
      describe: 'Exponent used to rescale allocations',
    },
    cutoffMainnet: {
      default: 14339625,
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
      default: 25,
      type: 'number',
      describe: 'Minimum reward size in $AURA',
    },
    auraPrice: {
      default: 10,
      type: 'number',
      describe: 'Hypothetical Aura price used to calculate airdrop value',
    },
    balancerVoteProposalId: {
      type: 'string',
      default:
        '0xa3548202efb91c59c40586d0cd3e71655529edef196d814bff145cf1cc0fcbf1',
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
