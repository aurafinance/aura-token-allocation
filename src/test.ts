import { MerkleTree } from 'merkletreejs'
import assert from 'assert'
import { BigNumber } from 'ethers'
import { keccak256, solidityKeccak256 } from 'ethers/lib/utils'
import allocations from '../artifacts/initial/allocations.json'
import report from '../artifacts/initial/report.json'

const address = '0x0a0f9bad027261b47eb4e502c6b2a2a2dfc9699d'

const hashFn = (data: string) => keccak256(data).slice(2)

const createTreeWithAccounts = (
  accounts: Record<string, string>,
): MerkleTree => {
  const elements = Object.entries(accounts).map(([account, balance]) =>
    solidityKeccak256(['address', 'uint256'], [account, balance]),
  )
  return new MerkleTree(elements, hashFn, { sort: true })
}

const getAccountBalanceProof = (
  tree: MerkleTree,
  account: string,
  balance: BigNumber,
) => {
  const element = solidityKeccak256(
    ['address', 'uint256'],
    [account, balance.toString()],
  )
  return tree.getHexProof(element)
}

const tree = createTreeWithAccounts(allocations)

assert(tree.getHexRoot() == report.rootHash, 'hex root does not match')

assert(
  tree.verify(
    getAccountBalanceProof(tree, address, BigNumber.from(allocations[address])),
    solidityKeccak256(['address', 'uint256'], [address, allocations[address]]),
    report.rootHash,
  ),
  'did not verify proof',
)
