import pRetry from 'p-retry'
import cliProgress, { SingleBar } from 'cli-progress'
import { GraphQLClient } from 'graphql-request'
import { getSdk, PoolQuery, Sdk } from './graphql/balancer/balancer_lp'

const fetchPoolIds = async (sdk: Sdk) => {
  const bar = new cliProgress.SingleBar(
    { format: `Fetching Balancer pool IDs {status}` },
    cliProgress.Presets.shades_grey,
  )
  bar.start(100, 0, { status: 'Fetching' })

  const query = await sdk.PoolIDs()
  const poolIds = query.pools.map((p) => p.id)
  bar.update({ status: `Done (${poolIds.length} pools)` })
  bar.stop()

  return poolIds
}

const exhaustPoolQuery = async (sdk: Sdk, bar: SingleBar, poolId: string) => {
  let i = 0
  const limit = 500

  const poolData: PoolQuery['pools'][0][] = []

  const runQuery = async () => {
    let skip = i * limit
    bar.update({ status: `ID: ${poolId} ${skip}-${skip + limit}` })

    const pool = await pRetry(async () => {
      const query_ = await sdk.Pool({
        poolId,
        sharesSkip: skip,
        sharesLimit: limit,
      })
      if (!query_.pools?.[0]?.id) throw new Error('Missing pool in query')
      return query_.pools[0]
    })

    poolData.push(pool)

    if (pool.shares.length === limit) {
      i++
      await runQuery()
    }
  }

  await runQuery()

  const { id, tokens, totalWeight, liquidity } = poolData[0]
  return {
    id,
    tokens,
    totalWeight,
    liquidity,
    shares: poolData.reduce((prev, pool) => prev.concat(pool.shares), []),
  }
}

const fetchPools = async (sdk: Sdk, poolIds: string[]) => {
  const bar = new cliProgress.SingleBar(
    { format: `Fetching Balancer LPs {bar} {status}` },
    cliProgress.Presets.shades_grey,
  )
  bar.start(poolIds.length, 0, { status: 'Fetching' })

  const pools = []
  for (let i = 0; i < poolIds.length; i++) {
    const poolId = poolIds[i]
    bar.update(i, { status: `ID: ${poolId}` })
    const pool = await exhaustPoolQuery(sdk, bar, poolId)
    pools.push(pool)
  }

  bar.update(poolIds.length, { status: `Done` })
  bar.stop()
  return pools
}

const fetchBalancerGraphData = async () => {
  // TODO arbitrum etc
  const client = new GraphQLClient(
    'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer',
  )
  const sdk = getSdk(client)

  const poolIds = await fetchPoolIds(sdk)
  const pools = await fetchPools(sdk, poolIds)
  return { pools }
}

export const fetchGraphData = async () => {
  const balancer = await fetchBalancerGraphData()
  return { balancer }
}
