import { OrderedMap } from 'immutable'
import { BigNumber } from 'ethers'
import { pipeline } from 'ts-pipe-compose'

import { Accounts, AllocationMap, Config, Data, GenesisSpec } from '../../types'
import { ZERO } from '../../constants'
import { getAccounts } from './getAccounts'
import { rescale } from './rescale'
import { explain } from './explain'
import { cullShrimp } from './cullShrimp'

export const getAllocations = async (
  data: Data,
  spec: GenesisSpec,
  config: Config,
): Promise<{
  allocations: AllocationMap
  accounts: Accounts
  config: Config
}> => {
  const allAccounts = await getAccounts(data)

  const accounts = pipeline(
    () => ({ accounts: allAccounts, config, spec }),
    explain('All accounts'),
    rescale,
    explain('Rescaled (before culling shrimp)'),
    cullShrimp,
    explain('Shrimp culled'),
    rescale,
    explain('Rescaled (final)'),
    (result) => result.accounts,
  )()

  const allocations: AllocationMap = OrderedMap(
    accounts
      .map<BigNumber>((account) =>
        account.get('rescaledAllocation').get('total', ZERO),
      )
      .toOrderedMap()
      .sort((a, b) => (a.gt(b) ? -1 : 1)),
  )

  return { allocations, accounts, config }
}
