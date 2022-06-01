import dune from './dune.json'
import fs from 'fs'
import path from 'path'

const main = async () => {
  const holders = dune.bveCVX
  const total = holders.reduce((prev, holder) => prev + holder.amount, 0)
  const json = Object.fromEntries(
    holders.map(({ account, amount }) => [
      account,
      (amount / total).toFixed(18),
    ]),
  )
  await fs.promises.writeFile(
    path.join(process.cwd(), '/data/bveCvx.json'),
    JSON.stringify(json),
  )
}

await main()
