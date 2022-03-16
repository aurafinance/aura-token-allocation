import { readCache, writeCache } from './cache'
import { fetchDuneData } from './dune'
import { fetchSnapshotData } from './snapshot'
import { fetchGraphData } from './graph'
import { Data } from '../types'

export const fetchData = async ({ cache }: { cache?: boolean }) => {
  if (cache) {
    const data = await readCache()
    if (data && Object.values(data.dune).some((val) => val.length)) return data
  }

  const dune = await fetchDuneData()
  const snapshot = await fetchSnapshotData()
  const graph = await fetchGraphData()
  const data: Data = { dune, snapshot, graph }

  await writeCache(data)

  return data as any
}
