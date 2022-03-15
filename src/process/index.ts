import {
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
) => {
  let merkleDrop: MerkleDrop

  if (spec.id === MerkleDropId.GENESIS) {
    merkleDrop = createGenesisDrop(data, spec as unknown as GenesisSpec)
  } else {
    throw new Error('Unhandled spec')
  }

  await createDropArtifacts(merkleDrop)
}
