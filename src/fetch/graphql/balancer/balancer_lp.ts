import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type Balancer = {
  __typename?: 'Balancer';
  color: Scalars['String'];
  crpCount: Scalars['Int'];
  finalizedPoolCount: Scalars['Int'];
  id: Scalars['ID'];
  poolCount: Scalars['Int'];
  pools?: Maybe<Array<Pool>>;
  totalLiquidity: Scalars['BigDecimal'];
  totalSwapFee: Scalars['BigDecimal'];
  totalSwapVolume: Scalars['BigDecimal'];
  txCount: Scalars['BigInt'];
};


export type BalancerPoolsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Pool_Filter>;
};

export type Balancer_Filter = {
  color?: InputMaybe<Scalars['String']>;
  color_contains?: InputMaybe<Scalars['String']>;
  color_ends_with?: InputMaybe<Scalars['String']>;
  color_gt?: InputMaybe<Scalars['String']>;
  color_gte?: InputMaybe<Scalars['String']>;
  color_in?: InputMaybe<Array<Scalars['String']>>;
  color_lt?: InputMaybe<Scalars['String']>;
  color_lte?: InputMaybe<Scalars['String']>;
  color_not?: InputMaybe<Scalars['String']>;
  color_not_contains?: InputMaybe<Scalars['String']>;
  color_not_ends_with?: InputMaybe<Scalars['String']>;
  color_not_in?: InputMaybe<Array<Scalars['String']>>;
  color_not_starts_with?: InputMaybe<Scalars['String']>;
  color_starts_with?: InputMaybe<Scalars['String']>;
  crpCount?: InputMaybe<Scalars['Int']>;
  crpCount_gt?: InputMaybe<Scalars['Int']>;
  crpCount_gte?: InputMaybe<Scalars['Int']>;
  crpCount_in?: InputMaybe<Array<Scalars['Int']>>;
  crpCount_lt?: InputMaybe<Scalars['Int']>;
  crpCount_lte?: InputMaybe<Scalars['Int']>;
  crpCount_not?: InputMaybe<Scalars['Int']>;
  crpCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  finalizedPoolCount?: InputMaybe<Scalars['Int']>;
  finalizedPoolCount_gt?: InputMaybe<Scalars['Int']>;
  finalizedPoolCount_gte?: InputMaybe<Scalars['Int']>;
  finalizedPoolCount_in?: InputMaybe<Array<Scalars['Int']>>;
  finalizedPoolCount_lt?: InputMaybe<Scalars['Int']>;
  finalizedPoolCount_lte?: InputMaybe<Scalars['Int']>;
  finalizedPoolCount_not?: InputMaybe<Scalars['Int']>;
  finalizedPoolCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  poolCount?: InputMaybe<Scalars['Int']>;
  poolCount_gt?: InputMaybe<Scalars['Int']>;
  poolCount_gte?: InputMaybe<Scalars['Int']>;
  poolCount_in?: InputMaybe<Array<Scalars['Int']>>;
  poolCount_lt?: InputMaybe<Scalars['Int']>;
  poolCount_lte?: InputMaybe<Scalars['Int']>;
  poolCount_not?: InputMaybe<Scalars['Int']>;
  poolCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  totalLiquidity?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidity_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidity_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidity_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidity_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidity_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidity_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalSwapFee?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapFee_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapFee_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapFee_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalSwapFee_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapFee_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapFee_not?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalSwapVolume?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalSwapVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Balancer_OrderBy {
  Color = 'color',
  CrpCount = 'crpCount',
  FinalizedPoolCount = 'finalizedPoolCount',
  Id = 'id',
  PoolCount = 'poolCount',
  Pools = 'pools',
  TotalLiquidity = 'totalLiquidity',
  TotalSwapFee = 'totalSwapFee',
  TotalSwapVolume = 'totalSwapVolume',
  TxCount = 'txCount'
}

/** The block at which the query should be executed. */
export type Block_Height = {
  /** Value containing a block hash */
  hash?: InputMaybe<Scalars['Bytes']>;
  /** Value containing a block number */
  number?: InputMaybe<Scalars['Int']>;
  /**
   * Value containing the minimum block number.
   * In the case of `number_gte`, the query will be executed on the latest block only if
   * the subgraph has progressed to or past the minimum block number.
   * Defaults to the latest block when omitted.
   */
  number_gte?: InputMaybe<Scalars['Int']>;
};

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Pool = {
  __typename?: 'Pool';
  active: Scalars['Boolean'];
  cap?: Maybe<Scalars['BigInt']>;
  controller: Scalars['Bytes'];
  createTime: Scalars['Int'];
  crp: Scalars['Boolean'];
  crpController?: Maybe<Scalars['Bytes']>;
  exitsCount: Scalars['BigInt'];
  factoryID: Balancer;
  finalized: Scalars['Boolean'];
  holdersCount: Scalars['BigInt'];
  id: Scalars['ID'];
  joinsCount: Scalars['BigInt'];
  liquidity: Scalars['BigDecimal'];
  name?: Maybe<Scalars['String']>;
  publicSwap: Scalars['Boolean'];
  rights: Array<Scalars['String']>;
  shares?: Maybe<Array<PoolShare>>;
  swapFee: Scalars['BigDecimal'];
  swaps?: Maybe<Array<Swap>>;
  swapsCount: Scalars['BigInt'];
  symbol?: Maybe<Scalars['String']>;
  tokens?: Maybe<Array<PoolToken>>;
  tokensCount: Scalars['BigInt'];
  tokensList: Array<Scalars['Bytes']>;
  totalShares: Scalars['BigDecimal'];
  totalSwapFee: Scalars['BigDecimal'];
  totalSwapVolume: Scalars['BigDecimal'];
  totalWeight: Scalars['BigDecimal'];
  tx?: Maybe<Scalars['Bytes']>;
};


export type PoolSharesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolShare_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PoolShare_Filter>;
};


export type PoolSwapsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Swap_Filter>;
};


export type PoolTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PoolToken_Filter>;
};

export type PoolShare = {
  __typename?: 'PoolShare';
  balance: Scalars['BigDecimal'];
  id: Scalars['ID'];
  poolId: Pool;
  userAddress: User;
};

export type PoolShare_Filter = {
  balance?: InputMaybe<Scalars['BigDecimal']>;
  balance_gt?: InputMaybe<Scalars['BigDecimal']>;
  balance_gte?: InputMaybe<Scalars['BigDecimal']>;
  balance_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  balance_lt?: InputMaybe<Scalars['BigDecimal']>;
  balance_lte?: InputMaybe<Scalars['BigDecimal']>;
  balance_not?: InputMaybe<Scalars['BigDecimal']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  poolId?: InputMaybe<Scalars['String']>;
  poolId_contains?: InputMaybe<Scalars['String']>;
  poolId_ends_with?: InputMaybe<Scalars['String']>;
  poolId_gt?: InputMaybe<Scalars['String']>;
  poolId_gte?: InputMaybe<Scalars['String']>;
  poolId_in?: InputMaybe<Array<Scalars['String']>>;
  poolId_lt?: InputMaybe<Scalars['String']>;
  poolId_lte?: InputMaybe<Scalars['String']>;
  poolId_not?: InputMaybe<Scalars['String']>;
  poolId_not_contains?: InputMaybe<Scalars['String']>;
  poolId_not_ends_with?: InputMaybe<Scalars['String']>;
  poolId_not_in?: InputMaybe<Array<Scalars['String']>>;
  poolId_not_starts_with?: InputMaybe<Scalars['String']>;
  poolId_starts_with?: InputMaybe<Scalars['String']>;
  userAddress?: InputMaybe<Scalars['String']>;
  userAddress_contains?: InputMaybe<Scalars['String']>;
  userAddress_ends_with?: InputMaybe<Scalars['String']>;
  userAddress_gt?: InputMaybe<Scalars['String']>;
  userAddress_gte?: InputMaybe<Scalars['String']>;
  userAddress_in?: InputMaybe<Array<Scalars['String']>>;
  userAddress_lt?: InputMaybe<Scalars['String']>;
  userAddress_lte?: InputMaybe<Scalars['String']>;
  userAddress_not?: InputMaybe<Scalars['String']>;
  userAddress_not_contains?: InputMaybe<Scalars['String']>;
  userAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  userAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  userAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  userAddress_starts_with?: InputMaybe<Scalars['String']>;
};

export enum PoolShare_OrderBy {
  Balance = 'balance',
  Id = 'id',
  PoolId = 'poolId',
  UserAddress = 'userAddress'
}

export type PoolToken = {
  __typename?: 'PoolToken';
  address: Scalars['String'];
  balance: Scalars['BigDecimal'];
  decimals: Scalars['Int'];
  denormWeight: Scalars['BigDecimal'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  poolId: Pool;
  symbol?: Maybe<Scalars['String']>;
};

export type PoolToken_Filter = {
  address?: InputMaybe<Scalars['String']>;
  address_contains?: InputMaybe<Scalars['String']>;
  address_ends_with?: InputMaybe<Scalars['String']>;
  address_gt?: InputMaybe<Scalars['String']>;
  address_gte?: InputMaybe<Scalars['String']>;
  address_in?: InputMaybe<Array<Scalars['String']>>;
  address_lt?: InputMaybe<Scalars['String']>;
  address_lte?: InputMaybe<Scalars['String']>;
  address_not?: InputMaybe<Scalars['String']>;
  address_not_contains?: InputMaybe<Scalars['String']>;
  address_not_ends_with?: InputMaybe<Scalars['String']>;
  address_not_in?: InputMaybe<Array<Scalars['String']>>;
  address_not_starts_with?: InputMaybe<Scalars['String']>;
  address_starts_with?: InputMaybe<Scalars['String']>;
  balance?: InputMaybe<Scalars['BigDecimal']>;
  balance_gt?: InputMaybe<Scalars['BigDecimal']>;
  balance_gte?: InputMaybe<Scalars['BigDecimal']>;
  balance_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  balance_lt?: InputMaybe<Scalars['BigDecimal']>;
  balance_lte?: InputMaybe<Scalars['BigDecimal']>;
  balance_not?: InputMaybe<Scalars['BigDecimal']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  decimals?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_not?: InputMaybe<Scalars['Int']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  denormWeight?: InputMaybe<Scalars['BigDecimal']>;
  denormWeight_gt?: InputMaybe<Scalars['BigDecimal']>;
  denormWeight_gte?: InputMaybe<Scalars['BigDecimal']>;
  denormWeight_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  denormWeight_lt?: InputMaybe<Scalars['BigDecimal']>;
  denormWeight_lte?: InputMaybe<Scalars['BigDecimal']>;
  denormWeight_not?: InputMaybe<Scalars['BigDecimal']>;
  denormWeight_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  poolId?: InputMaybe<Scalars['String']>;
  poolId_contains?: InputMaybe<Scalars['String']>;
  poolId_ends_with?: InputMaybe<Scalars['String']>;
  poolId_gt?: InputMaybe<Scalars['String']>;
  poolId_gte?: InputMaybe<Scalars['String']>;
  poolId_in?: InputMaybe<Array<Scalars['String']>>;
  poolId_lt?: InputMaybe<Scalars['String']>;
  poolId_lte?: InputMaybe<Scalars['String']>;
  poolId_not?: InputMaybe<Scalars['String']>;
  poolId_not_contains?: InputMaybe<Scalars['String']>;
  poolId_not_ends_with?: InputMaybe<Scalars['String']>;
  poolId_not_in?: InputMaybe<Array<Scalars['String']>>;
  poolId_not_starts_with?: InputMaybe<Scalars['String']>;
  poolId_starts_with?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
};

export enum PoolToken_OrderBy {
  Address = 'address',
  Balance = 'balance',
  Decimals = 'decimals',
  DenormWeight = 'denormWeight',
  Id = 'id',
  Name = 'name',
  PoolId = 'poolId',
  Symbol = 'symbol'
}

export type Pool_Filter = {
  active?: InputMaybe<Scalars['Boolean']>;
  active_in?: InputMaybe<Array<Scalars['Boolean']>>;
  active_not?: InputMaybe<Scalars['Boolean']>;
  active_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  cap?: InputMaybe<Scalars['BigInt']>;
  cap_gt?: InputMaybe<Scalars['BigInt']>;
  cap_gte?: InputMaybe<Scalars['BigInt']>;
  cap_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cap_lt?: InputMaybe<Scalars['BigInt']>;
  cap_lte?: InputMaybe<Scalars['BigInt']>;
  cap_not?: InputMaybe<Scalars['BigInt']>;
  cap_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  controller?: InputMaybe<Scalars['Bytes']>;
  controller_contains?: InputMaybe<Scalars['Bytes']>;
  controller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  controller_not?: InputMaybe<Scalars['Bytes']>;
  controller_not_contains?: InputMaybe<Scalars['Bytes']>;
  controller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  createTime?: InputMaybe<Scalars['Int']>;
  createTime_gt?: InputMaybe<Scalars['Int']>;
  createTime_gte?: InputMaybe<Scalars['Int']>;
  createTime_in?: InputMaybe<Array<Scalars['Int']>>;
  createTime_lt?: InputMaybe<Scalars['Int']>;
  createTime_lte?: InputMaybe<Scalars['Int']>;
  createTime_not?: InputMaybe<Scalars['Int']>;
  createTime_not_in?: InputMaybe<Array<Scalars['Int']>>;
  crp?: InputMaybe<Scalars['Boolean']>;
  crpController?: InputMaybe<Scalars['Bytes']>;
  crpController_contains?: InputMaybe<Scalars['Bytes']>;
  crpController_in?: InputMaybe<Array<Scalars['Bytes']>>;
  crpController_not?: InputMaybe<Scalars['Bytes']>;
  crpController_not_contains?: InputMaybe<Scalars['Bytes']>;
  crpController_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  crp_in?: InputMaybe<Array<Scalars['Boolean']>>;
  crp_not?: InputMaybe<Scalars['Boolean']>;
  crp_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  exitsCount?: InputMaybe<Scalars['BigInt']>;
  exitsCount_gt?: InputMaybe<Scalars['BigInt']>;
  exitsCount_gte?: InputMaybe<Scalars['BigInt']>;
  exitsCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  exitsCount_lt?: InputMaybe<Scalars['BigInt']>;
  exitsCount_lte?: InputMaybe<Scalars['BigInt']>;
  exitsCount_not?: InputMaybe<Scalars['BigInt']>;
  exitsCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  factoryID?: InputMaybe<Scalars['String']>;
  factoryID_contains?: InputMaybe<Scalars['String']>;
  factoryID_ends_with?: InputMaybe<Scalars['String']>;
  factoryID_gt?: InputMaybe<Scalars['String']>;
  factoryID_gte?: InputMaybe<Scalars['String']>;
  factoryID_in?: InputMaybe<Array<Scalars['String']>>;
  factoryID_lt?: InputMaybe<Scalars['String']>;
  factoryID_lte?: InputMaybe<Scalars['String']>;
  factoryID_not?: InputMaybe<Scalars['String']>;
  factoryID_not_contains?: InputMaybe<Scalars['String']>;
  factoryID_not_ends_with?: InputMaybe<Scalars['String']>;
  factoryID_not_in?: InputMaybe<Array<Scalars['String']>>;
  factoryID_not_starts_with?: InputMaybe<Scalars['String']>;
  factoryID_starts_with?: InputMaybe<Scalars['String']>;
  finalized?: InputMaybe<Scalars['Boolean']>;
  finalized_in?: InputMaybe<Array<Scalars['Boolean']>>;
  finalized_not?: InputMaybe<Scalars['Boolean']>;
  finalized_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  holdersCount?: InputMaybe<Scalars['BigInt']>;
  holdersCount_gt?: InputMaybe<Scalars['BigInt']>;
  holdersCount_gte?: InputMaybe<Scalars['BigInt']>;
  holdersCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  holdersCount_lt?: InputMaybe<Scalars['BigInt']>;
  holdersCount_lte?: InputMaybe<Scalars['BigInt']>;
  holdersCount_not?: InputMaybe<Scalars['BigInt']>;
  holdersCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  joinsCount?: InputMaybe<Scalars['BigInt']>;
  joinsCount_gt?: InputMaybe<Scalars['BigInt']>;
  joinsCount_gte?: InputMaybe<Scalars['BigInt']>;
  joinsCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  joinsCount_lt?: InputMaybe<Scalars['BigInt']>;
  joinsCount_lte?: InputMaybe<Scalars['BigInt']>;
  joinsCount_not?: InputMaybe<Scalars['BigInt']>;
  joinsCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity?: InputMaybe<Scalars['BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  liquidity_lt?: InputMaybe<Scalars['BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['BigDecimal']>;
  liquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  publicSwap?: InputMaybe<Scalars['Boolean']>;
  publicSwap_in?: InputMaybe<Array<Scalars['Boolean']>>;
  publicSwap_not?: InputMaybe<Scalars['Boolean']>;
  publicSwap_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  rights?: InputMaybe<Array<Scalars['String']>>;
  rights_contains?: InputMaybe<Array<Scalars['String']>>;
  rights_not?: InputMaybe<Array<Scalars['String']>>;
  rights_not_contains?: InputMaybe<Array<Scalars['String']>>;
  swapFee?: InputMaybe<Scalars['BigDecimal']>;
  swapFee_gt?: InputMaybe<Scalars['BigDecimal']>;
  swapFee_gte?: InputMaybe<Scalars['BigDecimal']>;
  swapFee_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  swapFee_lt?: InputMaybe<Scalars['BigDecimal']>;
  swapFee_lte?: InputMaybe<Scalars['BigDecimal']>;
  swapFee_not?: InputMaybe<Scalars['BigDecimal']>;
  swapFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  swapsCount?: InputMaybe<Scalars['BigInt']>;
  swapsCount_gt?: InputMaybe<Scalars['BigInt']>;
  swapsCount_gte?: InputMaybe<Scalars['BigInt']>;
  swapsCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  swapsCount_lt?: InputMaybe<Scalars['BigInt']>;
  swapsCount_lte?: InputMaybe<Scalars['BigInt']>;
  swapsCount_not?: InputMaybe<Scalars['BigInt']>;
  swapsCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  tokensCount?: InputMaybe<Scalars['BigInt']>;
  tokensCount_gt?: InputMaybe<Scalars['BigInt']>;
  tokensCount_gte?: InputMaybe<Scalars['BigInt']>;
  tokensCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokensCount_lt?: InputMaybe<Scalars['BigInt']>;
  tokensCount_lte?: InputMaybe<Scalars['BigInt']>;
  tokensCount_not?: InputMaybe<Scalars['BigInt']>;
  tokensCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokensList?: InputMaybe<Array<Scalars['Bytes']>>;
  tokensList_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  tokensList_not?: InputMaybe<Array<Scalars['Bytes']>>;
  tokensList_not_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  totalShares?: InputMaybe<Scalars['BigDecimal']>;
  totalShares_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalShares_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalShares_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalShares_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalShares_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalShares_not?: InputMaybe<Scalars['BigDecimal']>;
  totalShares_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalSwapFee?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapFee_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapFee_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapFee_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalSwapFee_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapFee_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapFee_not?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalSwapVolume?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalSwapVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  totalSwapVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalWeight?: InputMaybe<Scalars['BigDecimal']>;
  totalWeight_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalWeight_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalWeight_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalWeight_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalWeight_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalWeight_not?: InputMaybe<Scalars['BigDecimal']>;
  totalWeight_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  tx?: InputMaybe<Scalars['Bytes']>;
  tx_contains?: InputMaybe<Scalars['Bytes']>;
  tx_in?: InputMaybe<Array<Scalars['Bytes']>>;
  tx_not?: InputMaybe<Scalars['Bytes']>;
  tx_not_contains?: InputMaybe<Scalars['Bytes']>;
  tx_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum Pool_OrderBy {
  Active = 'active',
  Cap = 'cap',
  Controller = 'controller',
  CreateTime = 'createTime',
  Crp = 'crp',
  CrpController = 'crpController',
  ExitsCount = 'exitsCount',
  FactoryId = 'factoryID',
  Finalized = 'finalized',
  HoldersCount = 'holdersCount',
  Id = 'id',
  JoinsCount = 'joinsCount',
  Liquidity = 'liquidity',
  Name = 'name',
  PublicSwap = 'publicSwap',
  Rights = 'rights',
  Shares = 'shares',
  SwapFee = 'swapFee',
  Swaps = 'swaps',
  SwapsCount = 'swapsCount',
  Symbol = 'symbol',
  Tokens = 'tokens',
  TokensCount = 'tokensCount',
  TokensList = 'tokensList',
  TotalShares = 'totalShares',
  TotalSwapFee = 'totalSwapFee',
  TotalSwapVolume = 'totalSwapVolume',
  TotalWeight = 'totalWeight',
  Tx = 'tx'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  balancer?: Maybe<Balancer>;
  balancers: Array<Balancer>;
  pool?: Maybe<Pool>;
  poolShare?: Maybe<PoolShare>;
  poolShares: Array<PoolShare>;
  poolToken?: Maybe<PoolToken>;
  poolTokens: Array<PoolToken>;
  pools: Array<Pool>;
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  tokenPrice?: Maybe<TokenPrice>;
  tokenPrices: Array<TokenPrice>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryBalancerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBalancersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Balancer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Balancer_Filter>;
};


export type QueryPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolShareArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolSharesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolShare_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolShare_Filter>;
};


export type QueryPoolTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolToken_Filter>;
};


export type QueryPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pool_Filter>;
};


export type QuerySwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySwapsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Swap_Filter>;
};


export type QueryTokenPriceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenPricesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenPrice_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenPrice_Filter>;
};


export type QueryTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transaction_Filter>;
};


export type QueryUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  balancer?: Maybe<Balancer>;
  balancers: Array<Balancer>;
  pool?: Maybe<Pool>;
  poolShare?: Maybe<PoolShare>;
  poolShares: Array<PoolShare>;
  poolToken?: Maybe<PoolToken>;
  poolTokens: Array<PoolToken>;
  pools: Array<Pool>;
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  tokenPrice?: Maybe<TokenPrice>;
  tokenPrices: Array<TokenPrice>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionBalancerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBalancersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Balancer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Balancer_Filter>;
};


export type SubscriptionPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolShareArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolSharesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolShare_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolShare_Filter>;
};


export type SubscriptionPoolTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolToken_Filter>;
};


export type SubscriptionPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pool_Filter>;
};


export type SubscriptionSwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSwapsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Swap_Filter>;
};


export type SubscriptionTokenPriceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokenPricesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenPrice_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenPrice_Filter>;
};


export type SubscriptionTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transaction_Filter>;
};


export type SubscriptionUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type Swap = {
  __typename?: 'Swap';
  caller: Scalars['Bytes'];
  feeValue: Scalars['BigDecimal'];
  id: Scalars['ID'];
  poolAddress?: Maybe<Pool>;
  poolLiquidity: Scalars['BigDecimal'];
  poolTotalSwapFee: Scalars['BigDecimal'];
  poolTotalSwapVolume: Scalars['BigDecimal'];
  timestamp: Scalars['Int'];
  tokenAmountIn: Scalars['BigDecimal'];
  tokenAmountOut: Scalars['BigDecimal'];
  tokenIn: Scalars['Bytes'];
  tokenInSym: Scalars['String'];
  tokenOut: Scalars['Bytes'];
  tokenOutSym: Scalars['String'];
  userAddress?: Maybe<User>;
  value: Scalars['BigDecimal'];
};

export enum SwapType {
  ExitswapExternAmountOut = 'exitswapExternAmountOut',
  ExitswapPoolAmountIn = 'exitswapPoolAmountIn',
  JoinswapExternAmountIn = 'joinswapExternAmountIn',
  JoinswapPoolAmountOut = 'joinswapPoolAmountOut',
  SwapExactAmountIn = 'swapExactAmountIn',
  SwapExactAmountOut = 'swapExactAmountOut'
}

export type Swap_Filter = {
  caller?: InputMaybe<Scalars['Bytes']>;
  caller_contains?: InputMaybe<Scalars['Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller_not?: InputMaybe<Scalars['Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  feeValue?: InputMaybe<Scalars['BigDecimal']>;
  feeValue_gt?: InputMaybe<Scalars['BigDecimal']>;
  feeValue_gte?: InputMaybe<Scalars['BigDecimal']>;
  feeValue_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  feeValue_lt?: InputMaybe<Scalars['BigDecimal']>;
  feeValue_lte?: InputMaybe<Scalars['BigDecimal']>;
  feeValue_not?: InputMaybe<Scalars['BigDecimal']>;
  feeValue_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  poolAddress?: InputMaybe<Scalars['String']>;
  poolAddress_contains?: InputMaybe<Scalars['String']>;
  poolAddress_ends_with?: InputMaybe<Scalars['String']>;
  poolAddress_gt?: InputMaybe<Scalars['String']>;
  poolAddress_gte?: InputMaybe<Scalars['String']>;
  poolAddress_in?: InputMaybe<Array<Scalars['String']>>;
  poolAddress_lt?: InputMaybe<Scalars['String']>;
  poolAddress_lte?: InputMaybe<Scalars['String']>;
  poolAddress_not?: InputMaybe<Scalars['String']>;
  poolAddress_not_contains?: InputMaybe<Scalars['String']>;
  poolAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  poolAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  poolAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  poolAddress_starts_with?: InputMaybe<Scalars['String']>;
  poolLiquidity?: InputMaybe<Scalars['BigDecimal']>;
  poolLiquidity_gt?: InputMaybe<Scalars['BigDecimal']>;
  poolLiquidity_gte?: InputMaybe<Scalars['BigDecimal']>;
  poolLiquidity_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  poolLiquidity_lt?: InputMaybe<Scalars['BigDecimal']>;
  poolLiquidity_lte?: InputMaybe<Scalars['BigDecimal']>;
  poolLiquidity_not?: InputMaybe<Scalars['BigDecimal']>;
  poolLiquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  poolTotalSwapFee?: InputMaybe<Scalars['BigDecimal']>;
  poolTotalSwapFee_gt?: InputMaybe<Scalars['BigDecimal']>;
  poolTotalSwapFee_gte?: InputMaybe<Scalars['BigDecimal']>;
  poolTotalSwapFee_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  poolTotalSwapFee_lt?: InputMaybe<Scalars['BigDecimal']>;
  poolTotalSwapFee_lte?: InputMaybe<Scalars['BigDecimal']>;
  poolTotalSwapFee_not?: InputMaybe<Scalars['BigDecimal']>;
  poolTotalSwapFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  poolTotalSwapVolume?: InputMaybe<Scalars['BigDecimal']>;
  poolTotalSwapVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  poolTotalSwapVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  poolTotalSwapVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  poolTotalSwapVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  poolTotalSwapVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  poolTotalSwapVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  poolTotalSwapVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  tokenAmountIn?: InputMaybe<Scalars['BigDecimal']>;
  tokenAmountIn_gt?: InputMaybe<Scalars['BigDecimal']>;
  tokenAmountIn_gte?: InputMaybe<Scalars['BigDecimal']>;
  tokenAmountIn_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  tokenAmountIn_lt?: InputMaybe<Scalars['BigDecimal']>;
  tokenAmountIn_lte?: InputMaybe<Scalars['BigDecimal']>;
  tokenAmountIn_not?: InputMaybe<Scalars['BigDecimal']>;
  tokenAmountIn_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  tokenAmountOut?: InputMaybe<Scalars['BigDecimal']>;
  tokenAmountOut_gt?: InputMaybe<Scalars['BigDecimal']>;
  tokenAmountOut_gte?: InputMaybe<Scalars['BigDecimal']>;
  tokenAmountOut_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  tokenAmountOut_lt?: InputMaybe<Scalars['BigDecimal']>;
  tokenAmountOut_lte?: InputMaybe<Scalars['BigDecimal']>;
  tokenAmountOut_not?: InputMaybe<Scalars['BigDecimal']>;
  tokenAmountOut_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  tokenIn?: InputMaybe<Scalars['Bytes']>;
  tokenInSym?: InputMaybe<Scalars['String']>;
  tokenInSym_contains?: InputMaybe<Scalars['String']>;
  tokenInSym_ends_with?: InputMaybe<Scalars['String']>;
  tokenInSym_gt?: InputMaybe<Scalars['String']>;
  tokenInSym_gte?: InputMaybe<Scalars['String']>;
  tokenInSym_in?: InputMaybe<Array<Scalars['String']>>;
  tokenInSym_lt?: InputMaybe<Scalars['String']>;
  tokenInSym_lte?: InputMaybe<Scalars['String']>;
  tokenInSym_not?: InputMaybe<Scalars['String']>;
  tokenInSym_not_contains?: InputMaybe<Scalars['String']>;
  tokenInSym_not_ends_with?: InputMaybe<Scalars['String']>;
  tokenInSym_not_in?: InputMaybe<Array<Scalars['String']>>;
  tokenInSym_not_starts_with?: InputMaybe<Scalars['String']>;
  tokenInSym_starts_with?: InputMaybe<Scalars['String']>;
  tokenIn_contains?: InputMaybe<Scalars['Bytes']>;
  tokenIn_in?: InputMaybe<Array<Scalars['Bytes']>>;
  tokenIn_not?: InputMaybe<Scalars['Bytes']>;
  tokenIn_not_contains?: InputMaybe<Scalars['Bytes']>;
  tokenIn_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  tokenOut?: InputMaybe<Scalars['Bytes']>;
  tokenOutSym?: InputMaybe<Scalars['String']>;
  tokenOutSym_contains?: InputMaybe<Scalars['String']>;
  tokenOutSym_ends_with?: InputMaybe<Scalars['String']>;
  tokenOutSym_gt?: InputMaybe<Scalars['String']>;
  tokenOutSym_gte?: InputMaybe<Scalars['String']>;
  tokenOutSym_in?: InputMaybe<Array<Scalars['String']>>;
  tokenOutSym_lt?: InputMaybe<Scalars['String']>;
  tokenOutSym_lte?: InputMaybe<Scalars['String']>;
  tokenOutSym_not?: InputMaybe<Scalars['String']>;
  tokenOutSym_not_contains?: InputMaybe<Scalars['String']>;
  tokenOutSym_not_ends_with?: InputMaybe<Scalars['String']>;
  tokenOutSym_not_in?: InputMaybe<Array<Scalars['String']>>;
  tokenOutSym_not_starts_with?: InputMaybe<Scalars['String']>;
  tokenOutSym_starts_with?: InputMaybe<Scalars['String']>;
  tokenOut_contains?: InputMaybe<Scalars['Bytes']>;
  tokenOut_in?: InputMaybe<Array<Scalars['Bytes']>>;
  tokenOut_not?: InputMaybe<Scalars['Bytes']>;
  tokenOut_not_contains?: InputMaybe<Scalars['Bytes']>;
  tokenOut_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  userAddress?: InputMaybe<Scalars['String']>;
  userAddress_contains?: InputMaybe<Scalars['String']>;
  userAddress_ends_with?: InputMaybe<Scalars['String']>;
  userAddress_gt?: InputMaybe<Scalars['String']>;
  userAddress_gte?: InputMaybe<Scalars['String']>;
  userAddress_in?: InputMaybe<Array<Scalars['String']>>;
  userAddress_lt?: InputMaybe<Scalars['String']>;
  userAddress_lte?: InputMaybe<Scalars['String']>;
  userAddress_not?: InputMaybe<Scalars['String']>;
  userAddress_not_contains?: InputMaybe<Scalars['String']>;
  userAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  userAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  userAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  userAddress_starts_with?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['BigDecimal']>;
  value_gt?: InputMaybe<Scalars['BigDecimal']>;
  value_gte?: InputMaybe<Scalars['BigDecimal']>;
  value_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  value_lt?: InputMaybe<Scalars['BigDecimal']>;
  value_lte?: InputMaybe<Scalars['BigDecimal']>;
  value_not?: InputMaybe<Scalars['BigDecimal']>;
  value_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
};

export enum Swap_OrderBy {
  Caller = 'caller',
  FeeValue = 'feeValue',
  Id = 'id',
  PoolAddress = 'poolAddress',
  PoolLiquidity = 'poolLiquidity',
  PoolTotalSwapFee = 'poolTotalSwapFee',
  PoolTotalSwapVolume = 'poolTotalSwapVolume',
  Timestamp = 'timestamp',
  TokenAmountIn = 'tokenAmountIn',
  TokenAmountOut = 'tokenAmountOut',
  TokenIn = 'tokenIn',
  TokenInSym = 'tokenInSym',
  TokenOut = 'tokenOut',
  TokenOutSym = 'tokenOutSym',
  UserAddress = 'userAddress',
  Value = 'value'
}

export type TokenPrice = {
  __typename?: 'TokenPrice';
  decimals: Scalars['Int'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  poolLiquidity: Scalars['BigDecimal'];
  poolTokenId?: Maybe<Scalars['String']>;
  price: Scalars['BigDecimal'];
  symbol?: Maybe<Scalars['String']>;
};

export type TokenPrice_Filter = {
  decimals?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_not?: InputMaybe<Scalars['Int']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  poolLiquidity?: InputMaybe<Scalars['BigDecimal']>;
  poolLiquidity_gt?: InputMaybe<Scalars['BigDecimal']>;
  poolLiquidity_gte?: InputMaybe<Scalars['BigDecimal']>;
  poolLiquidity_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  poolLiquidity_lt?: InputMaybe<Scalars['BigDecimal']>;
  poolLiquidity_lte?: InputMaybe<Scalars['BigDecimal']>;
  poolLiquidity_not?: InputMaybe<Scalars['BigDecimal']>;
  poolLiquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  poolTokenId?: InputMaybe<Scalars['String']>;
  poolTokenId_contains?: InputMaybe<Scalars['String']>;
  poolTokenId_ends_with?: InputMaybe<Scalars['String']>;
  poolTokenId_gt?: InputMaybe<Scalars['String']>;
  poolTokenId_gte?: InputMaybe<Scalars['String']>;
  poolTokenId_in?: InputMaybe<Array<Scalars['String']>>;
  poolTokenId_lt?: InputMaybe<Scalars['String']>;
  poolTokenId_lte?: InputMaybe<Scalars['String']>;
  poolTokenId_not?: InputMaybe<Scalars['String']>;
  poolTokenId_not_contains?: InputMaybe<Scalars['String']>;
  poolTokenId_not_ends_with?: InputMaybe<Scalars['String']>;
  poolTokenId_not_in?: InputMaybe<Array<Scalars['String']>>;
  poolTokenId_not_starts_with?: InputMaybe<Scalars['String']>;
  poolTokenId_starts_with?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['BigDecimal']>;
  price_gt?: InputMaybe<Scalars['BigDecimal']>;
  price_gte?: InputMaybe<Scalars['BigDecimal']>;
  price_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  price_lt?: InputMaybe<Scalars['BigDecimal']>;
  price_lte?: InputMaybe<Scalars['BigDecimal']>;
  price_not?: InputMaybe<Scalars['BigDecimal']>;
  price_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
};

export enum TokenPrice_OrderBy {
  Decimals = 'decimals',
  Id = 'id',
  Name = 'name',
  PoolLiquidity = 'poolLiquidity',
  PoolTokenId = 'poolTokenId',
  Price = 'price',
  Symbol = 'symbol'
}

export type Transaction = {
  __typename?: 'Transaction';
  action?: Maybe<SwapType>;
  block: Scalars['Int'];
  event?: Maybe<Scalars['String']>;
  gasPrice: Scalars['BigDecimal'];
  gasUsed: Scalars['BigDecimal'];
  id: Scalars['ID'];
  poolAddress?: Maybe<Pool>;
  sender?: Maybe<Scalars['Bytes']>;
  timestamp: Scalars['Int'];
  tx: Scalars['Bytes'];
  userAddress?: Maybe<User>;
};

export type Transaction_Filter = {
  action?: InputMaybe<SwapType>;
  action_in?: InputMaybe<Array<SwapType>>;
  action_not?: InputMaybe<SwapType>;
  action_not_in?: InputMaybe<Array<SwapType>>;
  block?: InputMaybe<Scalars['Int']>;
  block_gt?: InputMaybe<Scalars['Int']>;
  block_gte?: InputMaybe<Scalars['Int']>;
  block_in?: InputMaybe<Array<Scalars['Int']>>;
  block_lt?: InputMaybe<Scalars['Int']>;
  block_lte?: InputMaybe<Scalars['Int']>;
  block_not?: InputMaybe<Scalars['Int']>;
  block_not_in?: InputMaybe<Array<Scalars['Int']>>;
  event?: InputMaybe<Scalars['String']>;
  event_contains?: InputMaybe<Scalars['String']>;
  event_ends_with?: InputMaybe<Scalars['String']>;
  event_gt?: InputMaybe<Scalars['String']>;
  event_gte?: InputMaybe<Scalars['String']>;
  event_in?: InputMaybe<Array<Scalars['String']>>;
  event_lt?: InputMaybe<Scalars['String']>;
  event_lte?: InputMaybe<Scalars['String']>;
  event_not?: InputMaybe<Scalars['String']>;
  event_not_contains?: InputMaybe<Scalars['String']>;
  event_not_ends_with?: InputMaybe<Scalars['String']>;
  event_not_in?: InputMaybe<Array<Scalars['String']>>;
  event_not_starts_with?: InputMaybe<Scalars['String']>;
  event_starts_with?: InputMaybe<Scalars['String']>;
  gasPrice?: InputMaybe<Scalars['BigDecimal']>;
  gasPrice_gt?: InputMaybe<Scalars['BigDecimal']>;
  gasPrice_gte?: InputMaybe<Scalars['BigDecimal']>;
  gasPrice_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  gasPrice_lt?: InputMaybe<Scalars['BigDecimal']>;
  gasPrice_lte?: InputMaybe<Scalars['BigDecimal']>;
  gasPrice_not?: InputMaybe<Scalars['BigDecimal']>;
  gasPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  gasUsed?: InputMaybe<Scalars['BigDecimal']>;
  gasUsed_gt?: InputMaybe<Scalars['BigDecimal']>;
  gasUsed_gte?: InputMaybe<Scalars['BigDecimal']>;
  gasUsed_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  gasUsed_lt?: InputMaybe<Scalars['BigDecimal']>;
  gasUsed_lte?: InputMaybe<Scalars['BigDecimal']>;
  gasUsed_not?: InputMaybe<Scalars['BigDecimal']>;
  gasUsed_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  poolAddress?: InputMaybe<Scalars['String']>;
  poolAddress_contains?: InputMaybe<Scalars['String']>;
  poolAddress_ends_with?: InputMaybe<Scalars['String']>;
  poolAddress_gt?: InputMaybe<Scalars['String']>;
  poolAddress_gte?: InputMaybe<Scalars['String']>;
  poolAddress_in?: InputMaybe<Array<Scalars['String']>>;
  poolAddress_lt?: InputMaybe<Scalars['String']>;
  poolAddress_lte?: InputMaybe<Scalars['String']>;
  poolAddress_not?: InputMaybe<Scalars['String']>;
  poolAddress_not_contains?: InputMaybe<Scalars['String']>;
  poolAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  poolAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  poolAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  poolAddress_starts_with?: InputMaybe<Scalars['String']>;
  sender?: InputMaybe<Scalars['Bytes']>;
  sender_contains?: InputMaybe<Scalars['Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  sender_not?: InputMaybe<Scalars['Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  tx?: InputMaybe<Scalars['Bytes']>;
  tx_contains?: InputMaybe<Scalars['Bytes']>;
  tx_in?: InputMaybe<Array<Scalars['Bytes']>>;
  tx_not?: InputMaybe<Scalars['Bytes']>;
  tx_not_contains?: InputMaybe<Scalars['Bytes']>;
  tx_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  userAddress?: InputMaybe<Scalars['String']>;
  userAddress_contains?: InputMaybe<Scalars['String']>;
  userAddress_ends_with?: InputMaybe<Scalars['String']>;
  userAddress_gt?: InputMaybe<Scalars['String']>;
  userAddress_gte?: InputMaybe<Scalars['String']>;
  userAddress_in?: InputMaybe<Array<Scalars['String']>>;
  userAddress_lt?: InputMaybe<Scalars['String']>;
  userAddress_lte?: InputMaybe<Scalars['String']>;
  userAddress_not?: InputMaybe<Scalars['String']>;
  userAddress_not_contains?: InputMaybe<Scalars['String']>;
  userAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  userAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  userAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  userAddress_starts_with?: InputMaybe<Scalars['String']>;
};

export enum Transaction_OrderBy {
  Action = 'action',
  Block = 'block',
  Event = 'event',
  GasPrice = 'gasPrice',
  GasUsed = 'gasUsed',
  Id = 'id',
  PoolAddress = 'poolAddress',
  Sender = 'sender',
  Timestamp = 'timestamp',
  Tx = 'tx',
  UserAddress = 'userAddress'
}

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  sharesOwned?: Maybe<Array<PoolShare>>;
  swaps?: Maybe<Array<Swap>>;
  txs?: Maybe<Array<Transaction>>;
};


export type UserSharesOwnedArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolShare_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PoolShare_Filter>;
};


export type UserSwapsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Swap_Filter>;
};


export type UserTxsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Transaction_Filter>;
};

export type User_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export enum User_OrderBy {
  Id = 'id',
  SharesOwned = 'sharesOwned',
  Swaps = 'swaps',
  Txs = 'txs'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type PoolIDsQueryVariables = Exact<{ [key: string]: never; }>;


export type PoolIDsQuery = { __typename?: 'Query', pools: Array<{ __typename?: 'Pool', id: string }> };

export type PoolQueryVariables = Exact<{
  poolId: Scalars['ID'];
  sharesSkip: Scalars['Int'];
  sharesLimit: Scalars['Int'];
}>;


export type PoolQuery = { __typename?: 'Query', pools: Array<{ __typename?: 'Pool', id: string, totalWeight: any, liquidity: any, shares?: Array<{ __typename?: 'PoolShare', balance: any, userAddress: { __typename?: 'User', id: string } }> | null, tokens?: Array<{ __typename?: 'PoolToken', balance: any, symbol?: string | null, denormWeight: any }> | null }> };


export const PoolIDsDocument = gql`
    query PoolIDs {
  pools(
    where: {tokensList_contains: ["0xba100000625a3754423978a60c9317c58a424e3d"], liquidity_gt: 100000}
  ) {
    id
  }
}
    `;
export const PoolDocument = gql`
    query Pool($poolId: ID!, $sharesSkip: Int!, $sharesLimit: Int!) {
  pools(
    where: {id: $poolId, tokensList_contains: ["0xba100000625a3754423978a60c9317c58a424e3d"], liquidity_gt: 100000}
  ) {
    id
    totalWeight
    liquidity
    shares(
      first: $sharesLimit
      skip: $sharesSkip
      orderDirection: desc
      orderBy: balance
    ) {
      userAddress {
        id
      }
      balance
    }
    tokens {
      balance
      symbol
      denormWeight
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    PoolIDs(variables?: PoolIDsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PoolIDsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PoolIDsQuery>(PoolIDsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'PoolIDs', 'query');
    },
    Pool(variables: PoolQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PoolQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PoolQuery>(PoolDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Pool', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;