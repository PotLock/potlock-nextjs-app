import { useMemo } from "react";

import Link from "next/link";

import { nearSocialIndexerHooks } from "@/common/api/near-social-indexer";
import { ByAccountId } from "@/common/types";

export type AccountFollowStatsProps = ByAccountId & {};

export const AccountFollowStats: React.FC<AccountFollowStatsProps> = ({ accountId }) => {
  const { data: followerAccountIds = [] } = nearSocialIndexerHooks.useFollowerAccountIds({
    accountId,
  });

  const { data: followedAccountIds = [] } = nearSocialIndexerHooks.useFollowedAccountIds({
    accountId,
  });

  const followPageUrl = useMemo(
    () => `https://near.social/mob.near/widget/FollowPage?accountId=${accountId}`,
    [accountId],
  );

  return (
    <div className="flex items-center gap-4 max-[400px]:mt-2 md:gap-8">
      {followerAccountIds.length > 0 && (
        <Link target="_blank" href={`${followPageUrl}&tab=followers`} className="prose flex gap-1">
          <span className="font-600">{followerAccountIds.length}</span>
          <span>{"Followers"}</span>
        </Link>
      )}

      {followedAccountIds.length > 0 && (
        <Link target="_blank" href={`${followPageUrl}&tab=following`} className="prose flex gap-1">
          <span className="font-600">{followedAccountIds.length}</span>
          <span>{"Following"}</span>
        </Link>
      )}
    </div>
  );
};
