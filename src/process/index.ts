import {
  Data,
  GenesisSpec,
  MerkleDrop,
  MerkleDropId,
  MerkleDropSpec,
} from '../types'
import { createGenesisMerkleDrop } from './createGenesisDrop'
import { createDropArtifacts } from './createDropArtifacts'

export const createMerkleDrop = async <TSpec extends MerkleDropSpec>(
  data: Data,
  spec: TSpec,
) => {
  let merkleDrop: MerkleDrop

  if (spec.id === MerkleDropId.GENESIS) {
    merkleDrop = createGenesisMerkleDrop(data, spec as unknown as GenesisSpec)
  } else {
    throw new Error('Unhandled spec')
  }

  await createDropArtifacts(merkleDrop)
}
