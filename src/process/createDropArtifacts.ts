import { formatUnits, soliditySha256 } from 'ethers/lib/utils'
import fs from 'fs'
import path from 'path'
import { stringify } from 'csv-stringify'
import cliProgress from 'cli-progress'

import { Accounts, MerkleDrop } from '../types'
import { Account, SnapshotVote } from '../Account'

const createAccountsArtifactsItem = async (
  dirPath: string,
  name: string,
  accounts: Accounts,
) => {
  const inputArr = accounts
    .valueSeq()
    .sort((a, b) => (a.get('allocation').gt(b.get('allocation')) ? -1 : 1))
    .map((account) => {
      const totalBAL = account.get('BAL').add(account.get('uniswapBAL'))
      const vote = account.get('vote')
      const voteText =
        vote === SnapshotVote.No
          ? 'No'
          : vote === SnapshotVote.Yes
          ? 'Yes'
          : 'Did not vote'
      return [
        account.get('address'),
        account.get('allocation').toString(),
        totalBAL.toString(),
        account.get('vlCVX').toString(),
        account.get('votingPower'),
        voteText,
      ]
    })
    .toArray()

  {
    const writeStream = fs.createWriteStream(path.join(dirPath, `${name}.csv`))
    stringify(
      inputArr,
      {
        header: true,
        columns: [
          'Account',
          'Allocation',
          'Total BAL',
          'Total vlCVX',
          'Total voting power',
          'Vote',
        ],
      },
      (error, output) => {
        writeStream.write(output)
      },
    ).on('finish', writeStream.end)
  }

  await fs.promises.writeFile(
    path.join(dirPath, `${name}.json`),
    JSON.stringify(inputArr),
  )
}

const createAccountsArtifacts = async (
  dirPath: string,
  { accounts, dustAccounts }: MerkleDrop,
) => {
  await createAccountsArtifactsItem(dirPath, 'accounts', accounts)
  await createAccountsArtifactsItem(dirPath, 'dust-accounts', dustAccounts)
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
    JSON.stringify(inputArr),
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
    await fs.promises.rmdir(proofsPath, { recursive: true })
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
    dustAccounts,
    accounts,
    spec,
    merkleTree,
  }: MerkleDrop,
) => {
  const report = {
    totalAllocation: formatUnits(totalAllocation),
    totalDust: formatUnits(totalDust),
    allocations: allocations.size,
    dustAccounts: dustAccounts.size,
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
      createMerkleProofArtifacts,
      createReportArtifact,
    ].map((fn) => fn(dirPath, merkleDrop)),
  )
}