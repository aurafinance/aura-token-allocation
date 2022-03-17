import { formatUnits, soliditySha256 } from 'ethers/lib/utils'
import fs from 'fs'
import path from 'path'
import { stringify } from 'csv-stringify'
import cliProgress from 'cli-progress'
import { Seq } from 'immutable'

import { Accounts, MerkleDrop } from '../types'
import {
  Account,
  AccountProps,
  AllocationProps,
  SnapshotVote,
} from '../Account'
import { BigNumber } from 'ethers'

const formatBN = (bn: BigNumber) => bn.toString()

const formatAllocation = ({
  total,
  votingPower,
  vlCVX,
  BAL,
}: AllocationProps) => {
  return {
    total: formatBN(total),
    votingPower: formatBN(votingPower),
    vlCVX: formatBN(vlCVX),
    BAL: formatBN(BAL),
  }
}

const formatAccount = ({
  vote,
  address,
  rescaledAllocation,
  rawBalances,
}: Omit<AccountProps, 'rescaledAllocation' | 'rawBalances'> & {
  rawBalances: AllocationProps
  rescaledAllocation: AllocationProps
}) => {
  return {
    address,
    vote:
      vote === SnapshotVote.No ? 'N' : vote === SnapshotVote.Yes ? 'Y' : '-',
    rawBalances: formatAllocation(rawBalances),
    rescaledAllocation: formatAllocation(rescaledAllocation),
  }
}

const createAccountsArtifactsItem = async (
  dirPath: string,
  name: string,
  accounts: Accounts,
) => {
  const formattedAccounts: Seq.Indexed<ReturnType<typeof formatAccount>> =
    accounts
      .valueSeq()
      .sort((a, b) =>
        a
          .get('rescaledAllocation')
          .get('total')
          .gt(b.get('rescaledAllocation').get('total'))
          ? -1
          : 1,
      )
      .map((record) => record.toJS())
      .map(formatAccount)

  {
    const writeStream = fs.createWriteStream(path.join(dirPath, `${name}.csv`))
    stringify(
      formattedAccounts
        .map(
          ({
            address,
            rescaledAllocation: {
              total: rescaledTotal,
              BAL: rescaledBAL,
              votingPower: rescaledVotingPower,
              vlCVX: rescaledVlCVX,
            },
            rawBalances: {
              BAL: rawBAL,
              votingPower: rawVotingPower,
              vlCVX: rawVlCVX,
            },
            vote,
          }) => [
            address,
            rescaledTotal,
            rawBAL,
            rawVlCVX,
            rawVotingPower,
            rescaledBAL,
            rescaledVlCVX,
            rescaledVotingPower,
            vote,
          ],
        )
        .toArray(),
      {
        header: true,
        columns: [
          'Account',
          'Allocation',
          'BAL (raw)',
          'vlCVX (raw)',
          'Voting power (raw)',
          'BAL (rescaled)',
          'vlCVX (rescaled)',
          'Voting power (rescaled)',
          'Vote',
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
    path.join(dirPath, `${name}.json`),
    JSON.stringify(formattedAccountsObj),
  )
}

const createAccountsArtifacts = async (
  dirPath: string,
  { accounts }: MerkleDrop,
) => {
  await createAccountsArtifactsItem(dirPath, 'accounts', accounts)
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

  for (const [address, amount] of allocations) {
    bar.increment()

    const leaf = soliditySha256(
      ['address', 'uint256'],
      [address, amount.toString()],
    )
    const proof = merkleTree.getHexProof(leaf)

    const proofsPath = path.join(dirPath, 'proofs')
    try {
      await fs.promises.rm(proofsPath, { recursive: true })
    } catch (error) {
      // ignore
    }
    await fs.promises.mkdir(proofsPath, { recursive: true })

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
    allocations,
    totalAllocation,
    totalDust,
    accounts,
    spec,
    merkleTree,
  }: MerkleDrop,
) => {
  const report = {
    totalAllocation: formatUnits(totalAllocation),
    totalDust: formatUnits(totalDust),
    allocations: allocations.size,
    accounts: accounts.size,
    id: spec.id,
    rootHash: merkleTree.getHexRoot(),
  }
  await fs.promises.writeFile(
    path.join(dirPath, 'report.json'),
    JSON.stringify(report),
  )
}

export const createDropArtifacts = async (merkleDrop: MerkleDrop) => {
  const dirPath = path.join('./artifacts', merkleDrop.spec.id)
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
