import { Accounts, Config, Data, MerkleDropId } from '../types'
import { createMerkleDrop } from './createMerkleDrop'
import { createDropArtifacts } from './createDropArtifacts'
import { MILLION, ZERO } from '../constants'
import { exactToSimple } from '../utils'
import { SnapshotVote } from '../Account'
import { getAllAccounts } from './getAllAccounts'

export const createMerkleDrops = async (data: Data, config: Config) => {
  const allAccounts = await getAllAccounts(data)

  const balMerkleDrop = await createMerkleDrop({
    id: MerkleDropId.balancer,
    totalAllocation: MILLION.add(MILLION.div(2)),
    allAccounts,
    allocationKey: 'balancer',
    scaleExponent: config.scaleExponentBal,
    minAuraReward: config.minAuraRewardBalancer,
    getBalances: (accounts: Accounts) =>
      accounts.map((account) => {
        const balance = exactToSimple(account.get('BAL', ZERO))
        const vote = account.get('vote', SnapshotVote.DidNotVote)
        return vote === SnapshotVote.Yes
          ? balance * config.balancerVoteMultiplier
          : balance
      }),
  })

  const cvxMerkleDrop = await createMerkleDrop({
    id: MerkleDropId.convex,
    totalAllocation: MILLION,
    allAccounts,
    allocationKey: 'convex',
    scaleExponent: config.scaleExponentVlcvx,
    minAuraReward: config.minAuraRewardConvex,
    getBalances: (accounts: Accounts) =>
      accounts.map((account) => exactToSimple(account.get('vlCVX', ZERO))),
  })

  await createDropArtifacts(balMerkleDrop, config)
  await createDropArtifacts(cvxMerkleDrop, config)
}
