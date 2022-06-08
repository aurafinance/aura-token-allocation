import { Accounts, Config, Data, MerkleDropId } from '../types'
import { createMerkleDrop } from './createMerkleDrop'
import { createDropArtifacts } from './createDropArtifacts'
import { ZERO } from '../constants'
import { exactToSimple } from '../utils'
import { SnapshotVote } from '../Account'
import { getAccountsWithRedirections } from './getAccountsWithRedirections'
import { parseUnits } from 'ethers/lib/utils'
import { mergeMerkleDrops } from './mergeMerkleDrops'

export const createMerkleDrops = async (data: Data, config: Config) => {
  const { accounts, redirections } = await getAccountsWithRedirections(data)

  const balMerkleDrop = await createMerkleDrop({
    id: MerkleDropId.balancer,
    totalAllocation: parseUnits('1300000'),
    accounts,
    redirections,
    allocationKey: 'balancer',
    scaleExponent: config.scaleExponentBal,
    minAuraReward: parseFloat(config.minAuraRewardBalancer),
    getBalances: (accounts: Accounts) =>
      accounts.map((account) => {
        const balance = exactToSimple(account.get('BAL', ZERO))
        const vote = account.get('vote', SnapshotVote.DidNotVote)
        const votingPower = exactToSimple(account.get('votingPower', ZERO))
        const bonus =
          vote === SnapshotVote.Yes
            ? 2.2 * (votingPower * config.balancerVoteMultiplier)
            : 0
        return balance + bonus
      }),
  })

  const cvxMerkleDrop = await createMerkleDrop({
    id: MerkleDropId.convex,
    totalAllocation: parseUnits('1000000'),
    accounts,
    redirections,
    allocationKey: 'convex',
    scaleExponent: config.scaleExponentVlcvx,
    minAuraReward: parseFloat(config.minAuraRewardConvex),
    getBalances: (accounts: Accounts) =>
      accounts.map((account) => exactToSimple(account.get('vlCVX', ZERO))),
  })

  const nftMerkleDrop = await createMerkleDrop({
    id: MerkleDropId.nfts,
    totalAllocation: parseUnits('200000'),
    accounts,
    allocationKey: 'nfts',
    redirections,
    filterAccounts: (accounts: Accounts) =>
      accounts.filter((account) => account.get('lobsterDao', 0) > 0),
    getBalances: (accounts: Accounts) =>
      // One lobster will suffice
      accounts.map((account) => Math.min(1, account.get('lobsterDao', 0))),
  })

  // Merge all of these drops (sums the allocations)
  const mergedMerkleDrop = mergeMerkleDrops(
    MerkleDropId.initial,
    'merged',
    balMerkleDrop,
    cvxMerkleDrop,
    nftMerkleDrop,
  )

  await createDropArtifacts(mergedMerkleDrop)
}
