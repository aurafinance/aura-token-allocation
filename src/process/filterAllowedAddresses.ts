import { providers } from 'ethers'
import pRetry from 'p-retry'
import pLimit from 'p-limit'
import cliProgress from 'cli-progress'
import { readData, writeData } from '../fetch/data'

const GNOSIS_SAFE_CODE_1 =
  '608060405273ffffffffffffffffffffffffffffffffffffffff600054167fa619486e0000000000000000000000000000000000000000000000000000000060003514156050578060005260206000f35b3660008037600080366000845af43d6000803e60008114156070573d6000fd5b3d6000f3fea'

const GNOSIS_SAFE_CODE_2 =
  '608060405234801561001057600080fd5b506040516101e73803806101e78339818101604052602081101561003357600080fd5b8101908080519060200190929190505050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156100ca576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260248152602001806101c36024913960400191505060405180910390fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505060aa806101196000396000f3fe608060405273ffffffffffffffffffffffffffffffffffffffff600054167fa619486e0000000000000000000000000000000000000000000000000000000060003514156050578060005260206000f35b3660008037600080366000845af43d6000803e60008114156070573d6000fd5b3d6000f3fea265627a7a72315820d8a00dc4fe6bf675a9d7416fc2d00bb3433362aa8186b750f76c4027269667ff64736f6c634300050e0032496e76616c6964206d617374657220636f707920616464726573732070726f766964656400000000000000000000000034cfac646f301356faa8b21e94227e3583fe3f5f'

const GNOSIS_SAFE_CODE_3 =
  '608060405234801561001057600080fd5b506040516101e63803806101e68339818101604052602081101561003357600080fd5b8101908080519060200190929190505050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156100ca576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001806101c46022913960400191505060405180910390fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505060ab806101196000396000f3fe608060405273ffffffffffffffffffffffffffffffffffffffff600054167fa619486e0000000000000000000000000000000000000000000000000000000060003514156050578060005260206000f35b3660008037600080366000845af43d6000803e60008114156070573d6000fd5b3d6000f3fea2646970667358221220d1429297349653a4918076d650332de1a1068c5f3e07c5c82360c277770b955264736f6c63430007060033496e76616c69642073696e676c65746f6e20616464726573732070726f7669646564000000000000000000000000d9db270c1b5e3bd161e8c8503c55ceabee709552'

const ARGENT_1 =
  '0x60806040523615801560115750600034115b156082573373ffffffffffffffffffffffffffffffffffffffff16347f606834f57405380c4fb88d1f4850326ad3885f014bab3b568dfbf7a041eef7386000366040518080602001828103825284848281815260200192508082843760405192018290039550909350505050a360a8565b6000543660008037600080366000845af43d6000803e80801560a3573d6000f35b3d6000fd5b0000a165627a7a7230582009ad600070879c5d9739059132e69cc1b5b90d2b945f553b3f45ceea43d65c8f0029'

const ARGENT_2 =
  '0x6080604052366083573373ffffffffffffffffffffffffffffffffffffffff16347f606834f57405380c4fb88d1f4850326ad3885f014bab3b568dfbf7a041eef73860003660405180806020018281038252848482818152602001925080828437600083820152604051601f909101601f19169092018290039550909350505050a3005b600080543682833781823684845af490503d82833e80801560a2573d83f35b3d83fdfea264697066735822122081653946f6f0f024eb94b19bdaf1d69dc04d346dcb6092fa1369c9e2dacfa42164736f6c634300060c0033'

const ALLOWED_CODES = [
  GNOSIS_SAFE_CODE_1,
  GNOSIS_SAFE_CODE_2,
  GNOSIS_SAFE_CODE_3,
  ARGENT_1,
  ARGENT_2,
]

const isAllowedAddressOrCode = (address: string, code: string) =>
  code === '0x' ||
  ALLOWED_CODES.some((allowedCode) => code.includes(allowedCode))

export const filterAllowedAddresses = async (
  addresses: string[],
  whitelist: Set<string>,
): Promise<{ allowed: Set<string>; notAllowed: Set<string> }> => {
  const provider = new providers.InfuraProvider(
    'homestead',
    process.env.WEB3_PROJECT_ID,
  )

  const fileName = 'address-codes.json'
  const cached = (await readData<Record<string, string>>(fileName)) ?? {}

  const addressesToFetch = addresses.filter(
    (address) => !cached.hasOwnProperty(address) && !whitelist.has(address),
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

  await writeData(fileName, addressCodes)

  return Object.entries(addressCodes).reduce(
    (prev, [address, code]) => {
      const allowed =
        isAllowedAddressOrCode(address, code) || whitelist.has(address)
      return allowed
        ? { ...prev, allowed: prev.allowed.add(address) }
        : { ...prev, notAllowed: prev.notAllowed.add(address) }
    },
    { allowed: whitelist, notAllowed: new Set<string>() },
  )
}
