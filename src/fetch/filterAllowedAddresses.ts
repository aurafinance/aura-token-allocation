import { providers } from 'ethers'
import pRetry from 'p-retry'
import pLimit from 'p-limit'
import cliProgress from 'cli-progress'
import { readCache, writeCache } from './cache'

const ALLOWED_CODES = [
  // Gnosis Safe
  '0x608060405273ffffffffffffffffffffffffffffffffffffffff600054167fa619486e0000000000000000000000000000000000000000000000000000000060003514156050578060005260206000f35b3660008037600080366000845af43d6000803e60008114156070573d6000fd5b3d6000f3fea',
]

const isAllowedAddressCode = (code: string) => {
  if (code === '0x') return true
  return ALLOWED_CODES.some(
    (_code) => _code === code || code.slice(0, _code.length) === _code,
  )
}

export const filterAllowedAddresses = async (
  addresses: string[],
): Promise<{ allowed: Set<string>; notAllowed: Set<string> }> => {
  const provider = new providers.InfuraProvider(
    'homestead',
    process.env.WEB3_PROJECT_ID,
  )

  const fileName = 'address-codes.json'
  const cached = (await readCache<Record<string, string>>(fileName)) ?? {}

  const addressesToFetch = addresses.filter(
    (address) => !cached.hasOwnProperty(address),
  )

  let fetched: Record<string, string> = {}

  if (addressesToFetch.length) {
    const bar = new cliProgress.SingleBar(
      { format: `Fetching allowed addresses: {bar} {status}` },
      cliProgress.Presets.shades_grey,
    )

    bar.start(addressesToFetch.length, 0, { status: '' })

    const limit = pLimit(5)
    let count = 0
    const input = addressesToFetch.map((address) =>
      limit(() =>
        pRetry(
          async () => {
            const code = await provider.getCode(address)
            count += 1
            bar.update(count, { status: '' })
            return [address, code]
          },
          {
            retries: 3,
            onFailedAttempt: async (error) => {
              bar.update({ status: `Execution fetching failed, retrying` })
              console.error(error, address)
            },
          },
        ),
      ),
    )

    const fetchedEntries = await Promise.all(input)
    fetched = Object.fromEntries(fetchedEntries)

    bar.stop()
  }

  const addressCodes: Record<string, string> = { ...cached, ...fetched }

  await writeCache(fileName, addressCodes)

  return Object.entries(addressCodes).reduce(
    (prev, [address, code]) => {
      const allowed = isAllowedAddressCode(code)
      return allowed
        ? { ...prev, allowed: prev.allowed.add(address) }
        : { ...prev, notAllowed: prev.notAllowed.add(address) }
    },
    { allowed: new Set<string>(), notAllowed: new Set<string>() },
  )
}
