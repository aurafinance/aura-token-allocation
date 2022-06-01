import { BigNumber } from 'ethers'
import { formatUnits, solidityKeccak256 } from 'ethers/lib/utils'
import fs from 'fs'
import path from 'path'
import { stringify } from 'csv-stringify'
import cliProgress from 'cli-progress'
import { Seq } from 'immutable'

import { MerkleDrop } from '../types'
import {
  Account,
  AccountProps,
  AllocationProps,
  SnapshotVote,
} from '../Account'

const formatBN = (bn: BigNumber) => bn.toString()

const formatAllocation = ({
  convex,
  balancer,
  nfts,
  merged,
}: AllocationProps) => {
  return {
    convex: formatBN(convex),
    balancer: formatBN(balancer),
    nfts: formatBN(nfts),
    merged: formatBN(merged),
  }
}

const formatAccount = ({
  vote,
  address,
  allocation,
  lobsterDao,
  BAL,
  vlCVX,
  votingPower,
}: Omit<AccountProps, 'allocation'> & {
  allocation: AllocationProps
}) => {
  return {
    address,
    vote:
      vote === SnapshotVote.No ? 'N' : vote === SnapshotVote.Yes ? 'Y' : '-',
    lobsterDao,
    votingPower: formatBN(votingPower),
    vlCVX: formatBN(vlCVX),
    BAL: formatBN(BAL),
    allocation: formatAllocation(allocation),
  }
}

const createAccountsArtifactsItem = async (
  dirPath: string,
  { accounts, allocationKey: key, id }: MerkleDrop,
) => {
  const formattedAccounts: Seq.Indexed<ReturnType<typeof formatAccount>> =
    accounts
      .valueSeq()
      .sort((a, b) =>
        a.get('allocation').get(key).gt(b.get('allocation').get(key)) ? -1 : 1,
      )
      .map((record) => record.toJS())
      .map(formatAccount)

  {
    const writeStream = fs.createWriteStream(path.join(dirPath, `${id}.csv`))
    stringify(
      formattedAccounts
        .map(
          ({
            address,
            allocation: { [key]: allocation },
            BAL,
            votingPower,
            vlCVX,
            vote,
            lobsterDao,
          }) => [
            address,
            allocation,
            BAL,
            vlCVX,
            votingPower,
            vote,
            lobsterDao,
          ],
        )
        .toArray(),
      {
        header: true,
        columns: [
          'Account',
          'Allocation',
          'BAL',
          'vlCVX',
          'Voting power',
          'Vote',
          'NFT',
        ],
      },
      (error, output) => {
        writeStream.write(output)
      },
    ).on('finish', writeStream.end)
  }

  const formattedAccountsObj = Object.fromEntries(
    formattedAccounts
      .map(({ address, ...account }) => [address, account])
      .valueSeq()
      .toArray(),
  )
  await fs.promises.writeFile(
    path.join(dirPath, `${id}.json`),
    JSON.stringify(formattedAccountsObj),
  )
}

const createAccountsArtifacts = async (
  dirPath: string,
  merkleDrop: MerkleDrop,
) => {
  await createAccountsArtifactsItem(dirPath, merkleDrop)
}

const createAllocationsArtifacts = async (
  dirPath: string,
  { allocations }: MerkleDrop,
) => {
  const inputArr = allocations.map((amount) => amount.toString()).toArray()

  {
    const writeStream = fs.createWriteStream(
      path.join(dirPath, 'allocations.csv'),
    )
    stringify(
      inputArr,
      {
        header: true,
        columns: ['Account', 'Allocation'],
      },
      (error, output) => {
        writeStream.write(output)
      },
    ).on('finish', writeStream.end)
  }

  await fs.promises.writeFile(
    path.join(dirPath, 'allocations.json'),
    JSON.stringify(Object.fromEntries(inputArr)),
  )
}

const createMerkleProofArtifacts = async (
  dirPath: string,
  { merkleTree, allocations }: MerkleDrop,
) => {
  const bar = new cliProgress.SingleBar(
    { format: 'Generating Merkle proofs {bar} {percentage}%' },
    cliProgress.Presets.shades_grey,
  )
  bar.start(allocations.size, 0)

  const proofsPath = path.join(dirPath, 'proofs')
  try {
    await fs.promises.rm(proofsPath, { recursive: true })
  } catch (error) {
    // ignore
  }
  await fs.promises.mkdir(proofsPath, { recursive: true })

  for (const [address, amount] of allocations) {
    bar.increment()

    const element = solidityKeccak256(
      ['address', 'uint256'],
      [address, amount.toString()],
    )
    const proof = merkleTree.getHexProof(element)

    await fs.promises.writeFile(
      path.join(proofsPath, `${address}.json`),
      JSON.stringify({ account: proof }),
    )
  }

  bar.stop()
}

const createReportArtifact = async (
  dirPath: string,
  {
    id,
    allocations,
    totalAllocation,
    totalDust,
    accounts,
    merkleTree,
  }: MerkleDrop,
) => {
  const report = {
    totalAllocation: formatUnits(totalAllocation),
    totalDust: formatUnits(totalDust),
    allocations: allocations.size,
    accounts: accounts.size,
    id: id,
    rootHash: merkleTree.getHexRoot(),
  }
  await fs.promises.writeFile(
    path.join(dirPath, 'report.json'),
    JSON.stringify(report),
  )
}

export const createDropArtifacts = async (merkleDrop: MerkleDrop) => {
  const dirPath = path.join('./artifacts', merkleDrop.id)
  await fs.promises.mkdir(dirPath, { recursive: true })

  await Promise.all(
    [
      createAccountsArtifacts,
      createAllocationsArtifacts,
      // createMerkleProofArtifacts,
      createReportArtifact,
    ].map((fn) => fn(dirPath, merkleDrop)),
  )
}
