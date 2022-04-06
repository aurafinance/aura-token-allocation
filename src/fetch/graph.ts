import pRetry from 'p-retry'
import cliProgress, { SingleBar } from 'cli-progress'
import { GraphQLClient } from 'graphql-request'

import { getSdk, PoolQuery, Sdk } from './graphql/balancer/balancer_lp'
import { BAL } from '../constants'
import { Config, Data, Network } from '../types'
import { getCutoffBlock } from '../utils'

const fetchPoolIds = async (sdk: Sdk, config: Config, network: Network) => {
  const bar = new cliProgress.SingleBar(
    { format: `Fetching Balancer pool IDs ({network}): {status}` },
    cliProgress.Presets.shades_grey,
  )
  bar.start(100, 0, { status: 'Fetching', network })

  const query = await sdk.PoolIDs({
    blockNumber: getCutoffBlock(config, network),
    bal: BAL[network],
  })
  const poolIds = query.pools.map((p) => p.id)
  bar.update({ status: `Done (${poolIds.length} pools)` })
  bar.stop()

  return poolIds
}

const exhaustPoolQuery = async (
  sdk: Sdk,
  config: Config,
  bar: SingleBar,
  network: Network,
  poolId: string,
) => {
  let i = 0
  const limit = 500

  const poolData: PoolQuery['pools'][0][] = []

  const runQuery = async () => {
    let skip = i * limit
    bar.update({ iteration: i })

    const pool = await pRetry(
      async () => {
        const query_ = await sdk.Pool({
          blockNumber: getCutoffBlock(config, network),
          poolId,
          sharesSkip: skip,
          sharesLimit: limit,
        })
        bar.update({ status: 'Fetching' })
        if (!query_.pools?.[0]?.id) throw new Error('Missing pool in query')
        return query_.pools[0]
      },
      {
        onFailedAttempt: (error) => {
          bar.update({
            status: `${
              (error as any).response?.errors?.[0]?.message ?? 'Borked!'
            }: retrying...`,
          })
        },
      },
    )

    poolData.push(pool)

    if (pool.shares.length === limit && skip < 4000) {
      i++
      await runQuery()
    }
  }

  await runQuery()

  const { id, tokens, totalShares } = poolData[0]
  return {
    id,
    tokens,
    totalShares,
    shares: poolData.reduce((prev, pool) => prev.concat(pool.shares), []),
  }
}

const fetchPools = async (
  sdk: Sdk,
  config,
  network: Network,
  poolIds: string[],
) => {
  const bar = new cliProgress.SingleBar(
    {
      format: `Fetching Balancer LPs ({network}) {bar} {status}: ID {id} {iteration}`,
    },
    cliProgress.Presets.shades_grey,
  )
  bar.start(poolIds.length, 0, { status: 'Fetching', network, iteration: '' })

  const pools: Awaited<ReturnType<typeof exhaustPoolQuery>>[] = []
  for (let i = 0; i < poolIds.length; i++) {
    const poolId = poolIds[i]
    bar.update(i, { status: 'Fetching', id: poolId.slice(0, 6) })
    const pool = await exhaustPoolQuery(sdk, config, bar, network, poolId)
    pools.push(pool)
  }

  bar.update(poolIds.length, { status: `Done` })
  bar.stop()
  return pools
}

const fetchBalancerPoolsData = async (config: Config) => {
  const endpoints = {
    mainnet:
      'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2',
    polygon:
      'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2',
    arbitrum:
      'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-arbitrum-v2',
  }

  const results: Record<
    Network,
    Awaited<ReturnType<typeof fetchPools>>
  > = {} as never

  for (const [network, endpoint] of Object.entries(endpoints) as [
    Network,
    string,
  ][]) {
    const client = new GraphQLClient(endpoint)
    const sdk = getSdk(client)
    const poolIds = await fetchPoolIds(sdk, config, network)
    results[network] = await fetchPools(sdk, config, network, poolIds)
  }

  return results
}

export const fetchGraphData = async (
  config: Config,
): Promise<Data['graph']> => {
  const pools = (await fetchBalancerPoolsData(
    config,
  )) as Data['graph']['balancer']['pools']
  return { balancer: { pools } }
}
