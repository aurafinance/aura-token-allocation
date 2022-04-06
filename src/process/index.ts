import {
  Config,
  Data,
  GenesisSpec,
  MerkleDrop,
  MerkleDropId,
  MerkleDropSpec,
} from '../types'
import { createGenesisDrop } from './genesis'
import { createDropArtifacts } from './createDropArtifacts'

export const createMerkleDrop = async <TSpec extends MerkleDropSpec>(
  data: Data,
  spec: TSpec,
  config: Config,
) => {
  let merkleDrop: MerkleDrop

  if (spec.id === MerkleDropId.GENESIS) {
    merkleDrop = await createGenesisDrop(
      data,
      spec as unknown as GenesisSpec,
      config,
    )
  } else {
    throw new Error('Unhandled spec')
  }

  await createDropArtifacts(merkleDrop, config)
}
