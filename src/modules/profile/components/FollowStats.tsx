import Link from "next/link";

import { nearSocial } from "@/common/api/near-social";
import { ByAccountId } from "@/common/types";

export type FollowStatsProps = ByAccountId & {};

export const FollowStats: React.FC<FollowStatsProps> = ({ accountId }) => {
  const { data: accountFollowersList, error: accountFollowersError } =
    nearSocial.useAccountFollowers({ accountId });

  console.log(accountFollowersError);

  return accountFollowersError ? null : (
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
