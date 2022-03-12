-- For a permanent version of this query please visit: https://dune.xyz/queries/336910
-- We tally up the incoming and outgoing transfers from each account.
with
    sourced_transfers as (
        -- Incoming
        select
            evt_tx_hash,
            evt_block_time,
            evt_block_number,
            "to" as account,
            value
        from erc20."ERC20_evt_Transfer"
        where contract_address = '\xba100000625a3754423978a60c9317c58a424e3d'
        union all
        -- Outgoing
        select
            evt_tx_hash,
            evt_block_time,
            evt_block_number,
            "from" as account,
            -1 * value as value
        from erc20."ERC20_evt_Transfer"
        where contract_address = '\xba100000625a3754423978a60c9317c58a424e3d'
    ),
    balances as (
        select
            account,
            sum(value) as amount
        from
            sourced_transfers
        where
            evt_block_number < '{{BlockNumber}}'
        group by
            account
    ),
    nonzero_balances as (
        select
            account,
            amount
        from
            balances
        where
            -- Remove < 1 BAL (too small for the airdrop)
            amount > 10^18
    )
select
    concat('0x', encode(account, 'hex')) as account,
    (amount / 10^18) as "amount"
from
    nonzero_balances
order by
    amount desc
