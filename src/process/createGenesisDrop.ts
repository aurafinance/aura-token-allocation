import { Map, OrderedMap } from 'immutable'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'

import {
  Accounts,
  AllocationMap,
  Data,
  GenesisSpec,
  MerkleDrop,
  MerkleDropSpec,
} from '../types'
import { Account, AccountRecord, SnapshotVote } from '../Account'
import { AURA_BAG_NGMI_THRESHOLD, ZERO } from '../constants'
import {
  createMerkleTree,
  divPrecisely,
  getFieldTotal,
  mulTruncate,
} from '../utils'
import { notInAccountLists } from '../account-lists'

const filterDust = (account: AccountRecord) =>
  account.get('allocation').gte(AURA_BAG_NGMI_THRESHOLD)

const getSpecAllocation = (spec: MerkleDropSpec): BigNumber =>
  Object.values(spec.groups).reduce((prev, amount) => prev.add(amount), ZERO)

const getGenesisAccounts = (
  data: Data,
  spec: GenesisSpec,
): { accounts: Accounts; dustAccounts: Accounts } => {
  let accounts: Accounts = Map()

  const updateAccountAllocations = () =>
    accounts.map((account) => {
      const vlCvxAlloc = mulTruncate(account.get('vlCVX'), rewardPerVlCVXHeld)
      const balAlloc = mulTruncate(account.get('BAL'), rewardPerBALHeld)
      const votingPowerAlloc = mulTruncate(
        account.get('votingPower'),
        rewardPerVotingPowerUsed,
      )
      const allocation = balAlloc.add(vlCvxAlloc).add(votingPowerAlloc)
      return account.set('allocation', allocation)
    })

  data.snapshot.votes
    .filter(({ voter }) => notInAccountLists(voter))
    .forEach(({ voter, vp, choice }) => {
      const account = Account({
        address: voter,
        vote: choice === 1 ? SnapshotVote.Yes : SnapshotVote.No,
        votingPower: parseUnits(vp.toFixed(18)),
      })

      accounts = accounts.mergeIn([account.address], account)
    })

  let totalVotingPowerUsed = getFieldTotal(accounts, 'votingPower')
  if (totalVotingPowerUsed.eq(0)) throw new Error('No voting power used')

  let rewardPerVotingPowerUsed = divPrecisely(
    spec.groups.yesVote,
    totalVotingPowerUsed,
  )

  data.dune.vlCVX
    .filter(({ account }) => notInAccountLists(account))
    .forEach((record) => {
      const account = Account({
        address: record.account,
        vlCVX: parseUnits(record.amount.toString()),
      })

      accounts = accounts.mergeIn([account.address], account)
    })

  let totalVlCVXHeld = getFieldTotal(accounts, 'vlCVX')
  if (totalVlCVXHeld.eq(0)) throw new Error('No vlCVX balances held')

  let rewardPerVlCVXHeld = divPrecisely(spec.groups.vlCVX, totalVlCVXHeld)

  data.dune.BAL.filter(({ account }) => notInAccountLists(account)).forEach(
    (record) => {
      const account = Account({
        address: record.account,
        BAL: parseUnits(record.amount.toString()),
      })

      accounts = accounts.mergeIn([account.address], account)
    },
  )

  let totalBALHeld = getFieldTotal(accounts, 'BAL')
  if (totalBALHeld.eq(0)) throw new Error('No BAL balances held')

  let rewardPerBALHeld = divPrecisely(spec.groups.BAL, totalBALHeld)

  // TODO BAL LP

  accounts = updateAccountAllocations()

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

  totalVlCVXHeld = getFieldTotal(accounts, 'vlCVX')
  totalBALHeld = getFieldTotal(accounts, 'BAL')
  totalVotingPowerUsed = getFieldTotal(accounts, 'votingPower')

  rewardPerVlCVXHeld = divPrecisely(spec.groups.vlCVX, totalVlCVXHeld)
  rewardPerBALHeld = divPrecisely(spec.groups.BAL, totalBALHeld)
  rewardPerVotingPowerUsed = divPrecisely(
    spec.groups.yesVote,
    totalVotingPowerUsed,
  )

  accounts = updateAccountAllocations()

  return { accounts, dustAccounts }
}

export const createGenesisMerkleDrop = (
  data: Data,
  spec: GenesisSpec,
): MerkleDrop => {
  const { accounts, dustAccounts } = getGenesisAccounts(data, spec)

  const allocations: AllocationMap = OrderedMap(
    accounts
      .map<BigNumber>((account) => account.get('allocation'))
      .toOrderedMap()
      .sort((a, b) => (a.gt(b) ? -1 : 1)),
  )

  const merkleTree = createMerkleTree(allocations)

  const specAllocation = getSpecAllocation(spec)
  const totalAllocation = allocations.reduce(
    (prev, allocation) => prev.add(allocation),
    ZERO,
  )
  const totalDust = specAllocation.sub(totalAllocation)

  return {
    spec,
    merkleTree,
    accounts,
    dustAccounts,
    allocations,
    totalAllocation,
    totalDust,
  }
}
