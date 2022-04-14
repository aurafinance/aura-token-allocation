import { BigNumber } from 'ethers'
import { Map, OrderedMap } from 'immutable'
import { MerkleTree } from 'merkletreejs'

import { AccountRecord, AllocationProps } from './Account'
import { PoolQuery } from './fetch/graphql/balancer/balancer_lp'
import { VotingEscrowLocksQuery } from './fetch/graphql/balancer-gauges/balancer_gauges'

export enum MerkleDropId {
  balancer = 'balancer',
  convex = 'convex',
}

export interface Data {
  dune: {
    vlCVX: { account: string; amount: number }[]
    balMainnet: { account: string; amount: number }[]
    balPolygon: { account: string; amount: number }[]
    // balArbitrum: { account: string; amount: number }[]
  }
  snapshot: { votes: { voter: string; vp: number; choice: 1 | 0 }[] }
  graph: {
    balancer: {
      pools: Record<Network, PoolQuery['pools'][number][]>
      votingEscrowLocks: VotingEscrowLocksQuery['votingEscrowLocks']
    }
  }
}

export type Accounts = Map<string, AccountRecord>

export type AllocationMap = OrderedMap<string, BigNumber>

export interface MerkleDrop {
  id: MerkleDropId
  allocationKey: keyof AllocationProps
  accounts: Accounts
  allocations: AllocationMap
  totalAllocation: BigNumber
  merkleTree: MerkleTree
  totalDust: BigNumber
}

export type Network = 'mainnet' | 'polygon' | 'arbitrum'

export interface Config {
  cache: boolean
  scaleExponentBal: number
  scaleExponentVlcvx: number
  cutoffMainnet: number
  cutoffPolygon: number
  cutoffArbitrum: number
  minAuraRewardBalancer: number
  minAuraRewardConvex: number
  balancerVoteProposalId: string
  balancerVoteMultiplier: number
}
