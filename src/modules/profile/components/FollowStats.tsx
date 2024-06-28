import Link from "next/link";

import { nearSocial } from "@/common/api/near-social";
import { ByAccountId } from "@/common/types";

export type FollowStatsProps = ByAccountId & {};

export const FollowStats: React.FC<FollowStatsProps> = ({ accountId }) => {
  const { data: followerAccountIds } = nearSocial.useFollowerAccountIds({
    accountId,
  });

  const { data: followedAccountIds } = nearSocial.useFollowedAccountIds({
    accountId,
  });

  return (
    <div un-flex="~" un-items="center" un-gap="4 md:8" un-mt="max-[400px]:2">
      {followerAccountIds && (
        <Link href="#" className="prose flex gap-1">
          <span un-font="600">{followerAccountIds?.length}</span>
          <span>Followers</span>
        </Link>
      )}

      {followedAccountIds && (
        <Link href="#" className="prose flex gap-1">
          <span un-font="600">{followedAccountIds?.length}</span>
          <span>Following</span>
        </Link>
      )}
    </div>
  );
};
