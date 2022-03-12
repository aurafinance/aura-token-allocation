import { gql, request } from 'graphql-request'

import { Data } from '../types'
import cliProgress from 'cli-progress'

const SNAPSHOT_URL = 'https://hub.snapshot.org/graphql'

const getBalancerVoters = async () => {
  // Get Balancer votes for the proposal
  // Select the first 10000 by voting power to avoid dust
  const { votes } = await request<
    {
      votes: {
        voter: string
        vp: number
        choice: 0 | 1
      }[]
    },
    { proposalId: string }
  >(
    SNAPSHOT_URL,
    gql`
      query Votes($proposalId: String!) {
        votes(
          where: { proposal: $proposalId }
          first: 10000
          orderBy: "vp"
          orderDirection: desc
        ) {
          voter
          choice
          vp
        }
      }
    `,
    {
      proposalId:
        '0xa3548202efb91c59c40586d0cd3e71655529edef196d814bff145cf1cc0fcbf1',
    },
  )
  return votes.map(({ voter, vp, choice }) => ({
    voter: voter.toLowerCase(),
    vp,
    choice,
  }))
}

export const fetchSnapshotData = async (): Promise<Data['snapshot']> => {
  const bar = new cliProgress.SingleBar(
    { format: `Getting Balancer voters... {status}` },
    cliProgress.Presets.shades_grey,
  )
  bar.start(1, 0)
  const votes = await getBalancerVoters()
  bar.update(1, { status: `Done (${votes.length}) records` })
  bar.stop()
  return { votes }
}
