import { readData, writeData } from './data'
import { fetchDuneData } from './dune'
import { fetchSnapshotData } from './snapshot'
import { fetchGraphData } from './graph'
import { fetchTokenBalances } from './covalent'
import { Config, Data } from '../types'
import { fetchNftHolders } from './nfts'
import { BAL } from '../constants'

export const fetchData = async (config: Config) => {
  const keys: (keyof Data)[] = [
    'dune',
    'snapshot',
    'graph',
    'nftHolders',
    'balArbitrum',
    'aaveBalMainnet',
  ]

  let data: Data = Object.fromEntries(
    await Promise.all(
      keys.map(async (key) => [key, await readData(`${key}.json`)]),
    ),
  )

  if (config.cache) {
    return data
  }

  const balArbitrum = await fetchTokenBalances(
    42161,
    config.cutoffArbitrum,
    BAL.arbitrum,
  )
  const aaveBalMainnet = await fetchTokenBalances(
    1,
    config.cutoffMainnet,
    '0x272f97b7a56a387ae942350bbc7df5700f8a4576',
  )
  const dune = await fetchDuneData(config)
  const snapshot = await fetchSnapshotData(config)
  const graph = await fetchGraphData(config)
  const nftHolders = await fetchNftHolders(config)
  data = {
    ...data,
    dune,
    snapshot,
    graph,
    nftHolders,
    balArbitrum,
    aaveBalMainnet,
  }

  await Promise.all(
    Object.entries(data).map(([key, value]) => writeData(`${key}.json`, value)),
  )

  return data as Data
}
