import Link from "next/link";

import { indexer } from "@/common/api/indexer";
import { ByAccountId } from "@/common/types";
import { cn } from "@/common/ui/utils";
import { AccountProfilePicture } from "@/modules/core";
import routesPath from "@/modules/core/routes";

export type AccountProfileLinkProps = ByAccountId & {
  classNames?: { root?: string; avatar?: string; name?: string };
};

export const AccountProfileLink: React.FC<AccountProfileLinkProps> = ({
  accountId,
  classNames,
}) => {
  const { data: account } = indexer.useAccount({ accountId });
  const { name } = account?.near_social_profile_data ?? {};

  return (
    <Link
      href={`${routesPath.PROFILE}/${accountId}`}
      target="_blank"
      className={cn(
        "decoration-none flex items-center gap-1",
        classNames?.root,
      )}
    >
      <AccountProfilePicture
        {...{ accountId }}
        className={cn("h-5 w-5", classNames?.avatar)}
      />

      <span className={cn("prose font-500 hover:underline", classNames?.name)}>
        {name ?? accountId}
      </span>
    </Link>
  );
};
