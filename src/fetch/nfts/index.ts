import 'isomorphic-fetch'
import { isAddress } from 'ethers/lib/utils'
import { Config } from '../../types'

const fetchLobsterHolders = async (
  blockNumber: number,
): Promise<Record<string, number>> => {
  const resp = await fetch(
    // Date is in the URL; update manually when changing block number.
    // See https://holders.lobsterdao.io/
    `https://raw.githubusercontent.com/lobster-dao/lobs-holders/snapshots/lobs_count_by_addr/lobs-count-by-addr_2022-05-23T10%3A19%3A27Z_blk14829000.csv`,
  )

  if (resp.status !== 200) {
    throw new Error(`Bad response from lobsterDAO holders: ${resp.status}`)
  }

  const csv = await resp.text()
  const rows = csv.split('\n').slice(1, -1)

  const entries = rows.map((row) => row.split(',').map((item) => item.trim()))

  if (
    !entries.every(
      ([address, count]) => isAddress(address) && parseInt(count) > 0,
    )
  ) {
    throw new Error('Invalid response from lobsterDAO holders')
  }

  return Object.fromEntries(
    entries.map(([address, count]) => [address.toLowerCase(), parseInt(count)]),
  )
}

export const fetchNftHolders = async (config: Config) => {
  const lobsterDao = await fetchLobsterHolders(config.cutoffMainnet)

  return {
    lobsterDao,
  }
}
