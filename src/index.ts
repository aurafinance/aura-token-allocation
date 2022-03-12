import { config as dotenvConfig } from 'dotenv'

import { fetchData } from './fetch'
import { createMerkleDrop } from './process'
import { MILLION, SCALE } from './constants'
import { GenesisSpec, MerkleDropId } from './types'
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

  const data = await fetchData({ cache: true })
  await createMerkleDrop(data, genesisSpec)
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
