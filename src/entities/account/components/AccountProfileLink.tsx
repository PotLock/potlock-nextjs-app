import Link from "next/link";

import { truncate } from "@/common/lib";
import { ByAccountId } from "@/common/types";
import { Badge } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { AccountProfilePicture, useAccountSocialProfile } from "@/entities/account";
import routesPath from "@/pathnames";

import { AccountSummaryPopup } from "./AccountSummaryPopup";

export type AccountProfileLinkProps = ByAccountId & {
  classNames?: { root?: string; avatar?: string; name?: string };
};

export const AccountProfileLink: React.FC<AccountProfileLinkProps> = ({
  accountId,
  classNames,
}) => {
  const { profile } = useAccountSocialProfile(accountId);

  return (
    <AccountSummaryPopup {...{ accountId }}>
      <Link
        href={`${routesPath.PROFILE}/${accountId}`}
        target="_blank"
        className={cn("decoration-none", classNames?.root)}
      >
        <Badge variant="secondary" className="flex w-fit max-w-80 items-center gap-2">
          <AccountProfilePicture {...{ accountId }} className={cn("h-4 w-4", classNames?.avatar)} />

          <span className={cn("font-500 w-fit text-nowrap", classNames?.name)}>
            {truncate(profile?.name ?? accountId, 32)}
          </span>
        </Badge>
      </Link>
    </AccountSummaryPopup>
  );
};
