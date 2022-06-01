import { BigNumber } from 'ethers'
import { Map, OrderedMap } from 'immutable'
import { Accounts, AllocationMap, MerkleDrop, MerkleDropId } from '../types'
import { createMerkleTree } from '../utils'
import { Account, Allocation, AllocationProps, SnapshotVote } from '../Account'

export const mergeMerkleDrops = (
  id: MerkleDropId,
  allocationKey: keyof AllocationProps,
  ...merkleDrops: MerkleDrop[]
): MerkleDrop => {
  const accounts = merkleDrops
    // Set the merged allocationKey based on the allocationKey for each MerkleDrop
    .map((merkleDrop) => ({
      ...merkleDrop,
      accounts: merkleDrop.accounts.map((account) =>
        account.update('allocation', (allocation) =>
          allocation.set(
            allocationKey,
            allocation.get(merkleDrop.allocationKey),
          ),
        ),
      ),
    }))
    .reduce<Accounts>(
      (prev, m) =>
        prev.mergeWith(
          // Safely merge without overriding fields with unset values
          (a, b) =>
            Account({
              address: a.get('address'),
              vote:
                a.get('vote') !== SnapshotVote.DidNotVote
                  ? a.get('vote')
                  : b.get('vote'),
              allocation: a
                .update('allocation', (allocation) =>
                  // Add the merged allocationKey value
                  // Other allocation values should stay the same across both records
                  allocation.update(allocationKey, (value) =>
                    value.add(b.get('allocation').get(allocationKey)),
                  ),
                )
                .get('allocation'),
              lobsterDao: a.get('lobsterDao') || b.get('lobsterDao'),
              BAL: a.get('BAL')?.gt(0) ? a.get('BAL') : b.get('BAL'),
              vlCVX: a.get('vlCVX')?.gt(0) ? a.get('vlCVX') : b.get('vlCVX'),
              votingPower: a.get('votingPower')?.gt(0)
                ? a.get('votingPower')
                : b.get('votingPower'),
            }),
          m.accounts,
        ),
      Map(),
    )

  const allocations = merkleDrops.reduce<AllocationMap>(
    (prev, m) =>
      prev
        .mergeWith((a, b) => a.add(b), m.allocations)
        .sort((a, b) => (a.gt(b) ? -1 : 1)),
    OrderedMap(),
  )

  const merkleTree = createMerkleTree(allocations)

  const totalAllocation = merkleDrops.reduce(
    (prev, m) => prev.add(m.totalAllocation),
    BigNumber.from(0),
  )

  const totalDust = merkleDrops.reduce(
    (prev, m) => prev.add(m.totalDust.abs()),
    BigNumber.from(0),
  )

  return {
    id,
    allocationKey,
    merkleTree,
    accounts,
    totalDust,
    allocations,
    totalAllocation,
  }
}
