import { Accounts, AllocationMap, Data, GenesisSpec } from '../../types'
import { getAccounts } from './getAccounts'
import { rescaleAccounts } from './rescaleAccounts'
import { getFieldTotal } from '../../utils'
import { formatUnits } from 'ethers/lib/utils'
import { OrderedMap } from 'immutable'
import { BigNumber } from 'ethers'
import { AccountRecord } from '../../Account'
import { AURA_BAG_NGMI_THRESHOLD } from '../../constants'

const filterDust = (account: AccountRecord) =>
  account.get('allocation').gte(AURA_BAG_NGMI_THRESHOLD)

export const getAllocations = (
  data: Data,
  spec: GenesisSpec,
): {
  allocations: AllocationMap
  accounts: Accounts
  dustAccounts: Accounts
} => {
  let accounts = getAccounts(data)

  accounts = rescaleAccounts(accounts, spec)

  const accountsSizeBefore = accounts.size
  const totalAllocationBefore = getFieldTotal(accounts, 'allocation')

  const dustAccounts = accounts.filterNot(filterDust)
  accounts = accounts.filter(filterDust)

  const totalAllocation = getFieldTotal(accounts, 'allocation')

  console.info(
    `Filtered out ${
      accountsSizeBefore - accounts.size
    } accounts under threshold: reallocating ${formatUnits(
      totalAllocationBefore.sub(totalAllocation),
    )} AURA`,
  )

  accounts = rescaleAccounts(accounts, spec)

  const allocations: AllocationMap = OrderedMap(
    accounts
      .map<BigNumber>((account) => account.get('allocation'))
      .toOrderedMap()
      .sort((a, b) => (a.gt(b) ? -1 : 1)),
  )

  return { allocations, accounts, dustAccounts }
}
