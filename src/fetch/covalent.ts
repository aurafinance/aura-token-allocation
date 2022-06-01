import fetch from 'node-fetch'
import { parseUnits } from 'ethers/lib/utils'

type Holders = {
  account: string
  amount: number
}[]

interface TokenHoldersPage {
  updated_at: string
  items: {
    contract_decimals: number
    contract_name: string
    contract_ticker_symbol: string
    contract_address: string
    supports_erc: unknown
    logo_url: string
    address: string
    balance: string
    total_supply: unknown
    block_height: 12779734
  }[]
  pagination: {
    has_more: boolean
    page_number: number
    page_size: number
    total_count?: number
  }
}

export const fetchTokenBalances = async (
  chainId: number,
  blockNumber: number,
  address: string,
): Promise<Holders> => {
  const key = process.env.COVALENT_KEY

  let pageNumber = 0
  let pages: TokenHoldersPage[] = []

  const fetchPage = async () => {
    const resp = await fetch(
      `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/token_holders/?quote-currency=USD&format=JSON&block-height=${blockNumber}&page-number=${pageNumber}&page-size=100&key=${key}`,
    )
    const page = (await resp.json()) as { data: TokenHoldersPage }
    pages.push(page.data)
    return page.data.pagination.has_more
  }

  while (await fetchPage()) {
    pageNumber++
  }

  return pages.reduce(
    (prev, page) => [
      ...prev,
      ...page.items.map((item) => ({
        account: item.address,
        amount: parseInt(item.balance) / 1e18,
      })),
    ],
    [],
  )
}
