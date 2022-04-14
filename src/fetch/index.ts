import { readData, writeData } from './data'
import { fetchDuneData } from './dune'
import { fetchSnapshotData } from './snapshot'
import { fetchGraphData } from './graph'
import { Config, Data } from '../types'

export const fetchData = async (config: Config) => {
  let data: Data = await readData('data.json')
  if (config.cache) {
    if (data && Object.values(data.dune).some((val) => val.length)) return data
  }

  const dune = await fetchDuneData(config)
  const snapshot = await fetchSnapshotData(config)
  const graph = await fetchGraphData(config)
  data = { ...data, dune, snapshot, graph }

  await writeData('data.json', data)

  return data as Data
}
