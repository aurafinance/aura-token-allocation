import { BigNumber } from 'ethers'
import { Map, OrderedMap } from 'immutable'
import { MerkleTree } from 'merkletreejs'

import { AccountRecord, AllocationProps } from './Account'
import { PoolQuery } from './fetch/graphql/balancer/balancer_lp'

export enum MerkleDropId {
  initial = 'initial',
  balancer = 'balancer',
  convex = 'convex',
  nfts = 'nfts',
}

type DuneHolders = {
  account: string
  amount: number
}[]

export interface Data {
  dune: {
    vlCVX: DuneHolders
    balMainnet: DuneHolders
    balPolygon: DuneHolders
    bveCVX: DuneHolders
  }
  balArbitrum: DuneHolders
  aaveBalMainnet: DuneHolders
  snapshot: { votes: { voter: string; vp: number; choice: 1 | 0 }[] }
  graph: {
    balancer: {
      pools: Record<Network, PoolQuery['pools'][number][]>
      votingEscrows: {
        id: string
        stakedSupply: string
        locks: { id: string; lockedBalance: string }[]
      }
    }
  }
  nftHolders: Record<'lobsterDao', Record<string, number>>
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
  minAuraRewardBalancer: string
  minAuraRewardConvex: string
  balancerVoteProposalId: string
  balancerVoteMultiplier: number
}
