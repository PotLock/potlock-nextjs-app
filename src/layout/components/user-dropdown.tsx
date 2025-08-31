import { LogOut } from "lucide-react";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { NOOP_STRING } from "@/common/constants";
import { truncate } from "@/common/lib";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Skeleton,
} from "@/common/ui/layout/components";
import { useWalletUserSession } from "@/common/wallet";
import { AccountProfilePicture, useAccountSocialProfile } from "@/entities/_shared/account";
import { listRegistrationStatuses } from "@/entities/list";
import { DaoAuthMenu } from "@/features/dao-auth";
import { rootPathnames } from "@/pathnames";

export const UserDropdown = () => {
  const walletUser = useWalletUserSession();

  const { profile } = useAccountSocialProfile({
    enabled: walletUser.isSignedIn,
    live: true,
    accountId: walletUser.accountId ?? NOOP_STRING,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 rounded-full">
        {walletUser.isSignedIn ? (
          <AccountProfilePicture accountId={walletUser.accountId} className="h-full w-full" />
        ) : (
          <Skeleton className="h-full w-full rounded-full" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        {walletUser.registrationStatus && (
          <DropdownMenuLabel
            className="flex items-center justify-between px-4 py-2"
            style={{
              color: listRegistrationStatuses[walletUser.registrationStatus].color,
              background: listRegistrationStatuses[walletUser.registrationStatus].background,
            }}
          >
            {walletUser.registrationStatus}

            <LazyLoadImage
              alt="Registration status icon"
              src={listRegistrationStatuses[walletUser.registrationStatus].icon}
              width={18}
              height={18}
            />
          </DropdownMenuLabel>
        )}

        <div className="flex flex-col gap-6 p-4">
          <DropdownMenuLabel className="flex gap-2 p-0">
            {walletUser.accountId && (
              <AccountProfilePicture accountId={walletUser.accountId} className="h-10 w-10" />
            )}

            <div className="flex flex-col">
              {profile?.name && <p className="font-semibold">{truncate(profile.name, 30)}</p>}

              {walletUser.accountId && (
                <p className="prose color-[#656565] text-xs">
                  {truncate(walletUser.accountId, 30)}
                </p>
              )}
            </div>
          </DropdownMenuLabel>

          {walletUser.isSignedIn && <DaoAuthMenu userAccountId={walletUser.accountId} />}

          <div className="rounded-md border border-[#DBDBDB]">
            {walletUser.accountId && (
              <Link href={`${rootPathnames.PROFILE}/${walletUser.accountId}`}>
                <DropdownMenuItem className="px-3 py-2.5 font-medium">
                  {walletUser.hasRegistrationApproved ? "My Project" : "My Profile"}
                </DropdownMenuItem>
              </Link>
            )}

            <Link href={`https://near.social/mob.near/widget/NotificationFeed`} target="_blank">
              <DropdownMenuItem className="px-3 py-2.5 font-medium">
                {"Notifications"}
              </DropdownMenuItem>
            </Link>
          </div>
        </div>

        <Button
          onClick={walletUser.logout}
          variant="brand-plain"
          className="w-full justify-start bg-[#F7F7F7] px-4 py-3"
        >
          <LogOut color="#F6767A" />
          <span className="prose">{"Sign Out"}</span>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
