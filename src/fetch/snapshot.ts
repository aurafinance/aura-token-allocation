import { gql, request } from 'graphql-request'
import cliProgress from 'cli-progress'

import { Config, Data } from '../types'

const SNAPSHOT_URL = 'https://hub.snapshot.org/graphql'

const getBalancerVoters = async (config: Config) => {
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
      proposalId: config.balancerVoteProposalId,
    },
  )
  return votes.map(({ voter, vp, choice }) => ({
    voter: voter.toLowerCase(),
    vp,
    choice,
  }))
}

export const fetchSnapshotData = async (
  config: Config,
): Promise<Data['snapshot']> => {
  const bar = new cliProgress.SingleBar(
    { format: `Fetching Balancer voters: {status}` },
    cliProgress.Presets.shades_grey,
  )
  bar.start(1, 0, { status: 'Fetching' })
  const votes = await getBalancerVoters(config)
  bar.update(1, { status: `Done (${votes.length} records)` })
  bar.stop()
  return { votes }
}
