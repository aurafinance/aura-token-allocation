# Aura Token Allocation

Scrapes data sources for token holders and creates Merkle drop allocations scaled for a fair distribution.

## Quick start

```shell
# Set env vars (you will need to set these in .env)
cp .env.example .env

# Install
yarn

# Run without using cached data. This will take some time.
# Caution: ~30k throttled requests to Infura will be made.
yarn start --cache false

# Optionally, run with config:
yarn start --cache true --scaleExponentBal 0.75 --scaleExponentVlcvx 0.75 --scaleExponentVote 0.4 --minAuraReward 30
```

## Configuration

- `cache`: Whether to use cached query results
- `scaleExponentBal`: Exponent used to rescale allocations (BAL)
- `scaleExponentVlcvx`: Exponent used to rescale allocations (vlCVX)
- `scaleExponentVote`: Exponent used to rescale allocations (Vote)
- `cutoffMainnet`: Snapshot cutoff block for Mainnet
- `cutoffPolygon`: Snapshot cutoff block for Polygon
- `cutoffArbitrum`: Snapshot cutoff block for Arbitrum
- `minAuraReward`: Minimum reward size in $AURA
- `balancerVoteProposalId`: Proposal ID from Snapshot used for the Balancer vote query

## Methodology

- Fetch data
  - Dune queries for vlCVX and BAL holders
  - Balancer Pool LPs from Balancer subgraphs
  - Votes from Balancer Snapshot
- Create Merkle Drop
  - Filter allowed addresses (EOAs and Gnosis Safes)
  - Remove claims under a given amount of Aura (prevent uneconomic claims)
  - Rescale allocations with a power distribution (reducing the Gini coefficients)
- Create artifacts
  - List of accounts
  - List of allocations
  - Report with Merkle root
  - Interactive tree map to visualise allocations
