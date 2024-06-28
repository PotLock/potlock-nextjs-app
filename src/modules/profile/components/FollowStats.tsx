import Link from "next/link";

import { nearSocial } from "@/common/api/near-social";
import { potlock } from "@/common/api/potlock";
import { ByAccountId } from "@/common/types";

export type FollowStatsProps = ByAccountId & {};

export const FollowStats: React.FC<FollowStatsProps> = ({ accountId }) => {
  const {
    // isLoading: isAccountLoading,
    // data: account,
    error: accountError,
  } = potlock.useAccount({ accountId });

  const { data: accountFollowersList } = nearSocial.useAccountFollowers({
    accountId,
  });

  return accountError ? null : (
    <div className="flex items-center gap-4 max-[400px]:mt-2 md:gap-8">
      <Link href="#" className="prose flex gap-1">
        <span un-font="600">{accountFollowersList?.length}</span>
        <span>Followers</span>
      </Link>

      <Link href="#" className="prose flex gap-1">
        <span un-font="600">{"x"}</span>
        <span>Following</span>
      </Link>
    </div>
  );
};
