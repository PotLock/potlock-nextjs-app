import Link from "next/link";

import { potlock } from "@/common/api/potlock";
import { ByAccountId } from "@/common/types";
import { cn } from "@/common/ui/utils";
import { AccountAvatar } from "@/modules/core";
import routesPath from "@/modules/core/routes";

export type ProfileLinkProps = ByAccountId & { className?: string };

export const ProfileLink: React.FC<ProfileLinkProps> = ({
  accountId,
  className,
}) => {
  const { data: account } = potlock.useAccount({ accountId });
  const { name } = account?.near_social_profile_data ?? {};

  return (
    <Link
      href={`${routesPath.PROFILE}/${accountId}`}
      target="_blank"
      className={cn("decoration-none flex items-center gap-1", className)}
    >
      <AccountAvatar {...{ accountId }} className="h-5 w-5" />

      <span className="prose font-500" un-decoration="hover:underline">
        {name ?? accountId}
      </span>
    </Link>
  );
};
