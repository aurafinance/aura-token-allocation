import { BigNumber } from 'ethers'
import { Map, OrderedMap } from 'immutable'
import { MerkleTree } from 'merkletreejs'

import { AccountRecord } from './Account'
import { PoolQuery } from './fetch/graphql/balancer/balancer_lp'

export enum MerkleDropId {
  GENESIS = 'Genesis',
  VE_BAL = 'veBAL',
}

export interface MerkleDropSpec {
  id: MerkleDropId
  groups: {
    [group: string]: BigNumber
  }
}

export interface GenesisSpec extends MerkleDropSpec {
  id: MerkleDropId.GENESIS
  groups: {
    vlCVX: BigNumber
    BAL: BigNumber
    yesVote: BigNumber
  }
}

export interface VeBalSpec extends MerkleDropSpec {
  id: MerkleDropId.VE_BAL
  groups: {
    veBAL: BigNumber
  }
}

export interface Data {
  dune: {
    vlCVX: { account: string; amount: number }[]
    BAL: { account: string; amount: number }[]
  }
  snapshot: { votes: { voter: string; vp: number; choice: 1 | 0 }[] }
  graph: {
    balancer: {
      pools: Record<
        'mainnet' | 'polygon' | 'arbitrum',
        PoolQuery['pools'][number][]
      >
    }
  }
}

export type Accounts = Map<string, AccountRecord>

export type AllocationMap = OrderedMap<string, BigNumber>

export interface MerkleDrop {
  spec: MerkleDropSpec
  accounts: Accounts
  allocations: AllocationMap
  totalAllocation: BigNumber
  merkleTree: MerkleTree
  totalDust: BigNumber
  dustAccounts: Accounts
}

export interface MerkleDrops {
  genesis: MerkleDrop
  veBAL?: MerkleDrop
}

export type Network = 'mainnet' | 'polygon' | 'arbitrum'
