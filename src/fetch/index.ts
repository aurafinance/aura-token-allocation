import { readCache, writeCache } from './cache'
import { fetchDuneData } from './dune'
import { fetchSnapshotData } from './snapshot'
import { fetchGraphData } from './graph'
import { Data } from '../types'

export const fetchData = async ({ cache }: { cache?: boolean }) => {
  let data: Data = await readCache()
  if (cache) {
    if (data && Object.values(data.dune).some((val) => val.length)) return data
  }

  // TODO make this configurable (just fetch x)
  const dune = await fetchDuneData()
  const snapshot = await fetchSnapshotData()
  const graph = await fetchGraphData()
  data = { ...data, dune, snapshot, graph }

  await writeCache(data)

  return data as any
}
