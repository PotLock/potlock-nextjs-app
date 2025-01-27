import Link from "next/link";

import { nearSocialIndexerHooks } from "@/common/api/near-social-indexer";
import { ByAccountId } from "@/common/types";

export type AccountFollowStatsProps = ByAccountId & {};

export const AccountFollowStats: React.FC<AccountFollowStatsProps> = ({ accountId }) => {
  const { data: followerAccountIds } = nearSocialIndexerHooks.useFollowerAccountIds({
    accountId,
  });

  const { data: followedAccountIds } = nearSocialIndexerHooks.useFollowedAccountIds({
    accountId,
  });

  // TODO: Links should lead to the corresponding Near Social profile pages
  return (
    <div className="flex items-center gap-4 max-[400px]:mt-2 md:gap-8">
      {followerAccountIds && (
        <Link href="#" className="prose flex gap-1">
          <span className="font-600">{followerAccountIds?.length}</span>
          <span>{"Followers"}</span>
        </Link>
      )}

      {followedAccountIds && (
        <Link href="#" className="prose flex gap-1">
          <span className="font-600">{followedAccountIds?.length}</span>
          <span>{"Following"}</span>
        </Link>
      )}
    </div>
  );
};
