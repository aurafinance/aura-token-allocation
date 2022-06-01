with
    cvx_locker_v1_transfers as (
        select
            "_user",
            sum("amount") as amount
        from
        (
            select
                "_user",
                sum("_lockedAmount") / 1e18 as amount
            from
                convex."CvxLocker_evt_Staked"
            where
                evt_block_number < '{{BlockNumber}}'
            group by
                "_user"
            union all
            select
                "_user",
                - sum("_amount") / 1e18 as amount
            from
                convex."CvxLocker_evt_Withdrawn"
            where
                evt_block_number < '{{BlockNumber}}'
            group by
                "_user"
        ) t
        group by
            "_user"
        order by
            amount desc
    ),
    cvx_locker_v2_transfers as (
        select
            "_user",
            sum("amount") as amount
        from
        (
            select
                "_user",
                sum("_lockedAmount") / 1e18 as amount
            from
                convex."CvxLockerV2_evt_Staked"
            where
                evt_block_number < '{{BlockNumber}}'
            group by
                "_user"
            union all
            select
                "_user",
                - sum("_amount") / 1e18 as amount
            from
                convex."CvxLockerV2_evt_Withdrawn"
            where
                evt_block_number < '{{BlockNumber}}'
            group by
                "_user"
        ) t
        group by
            "_user"
        order by
            amount desc
    ),
    merged_vlcvx_holders as (
        select
            "_user",
            sum("amount") as amount
        from
        (
            select
                *
            from
                cvx_locker_v1_transfers
            union all
            select
                *
            from
                cvx_locker_v2_transfers
        ) t
        group by
            "_user"
    )
select
    concat('0x', encode(_user, 'hex')) as account,
    amount
from
    merged_vlcvx_holders
where
    amount > 0
order by
    amount desc