import { useCallback } from "react";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { nearProtocolClient } from "@/common/blockchains/near-protocol";
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
import { DaoAuthForm } from "@/common/wallet/components/dao-auth-form";
import { AccountProfilePicture, useAccountSocialProfile } from "@/entities/_shared/account";
import { listRegistrationStatuses } from "@/entities/list";
import { rootPathnames } from "@/pathnames";

export const UserDropdown = () => {
  const viewer = useWalletUserSession();

  const { profile } = useAccountSocialProfile({
    enabled: viewer.isSignedIn,
    live: true,
    accountId: viewer.accountId ?? NOOP_STRING,
  });

  const logoutHandler = useCallback(() => {
    nearProtocolClient.walletApi.wallet?.signOut();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 rounded-full">
        {viewer.isSignedIn ? (
          <AccountProfilePicture accountId={viewer.accountId} className="h-full w-full" />
        ) : (
          <Skeleton className="h-full w-full rounded-full" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 p-0">
        {viewer.registrationStatus && (
          <DropdownMenuLabel
            className="flex items-center justify-between px-4 py-2"
            style={{
              color: listRegistrationStatuses[viewer.registrationStatus].color,
              background: listRegistrationStatuses[viewer.registrationStatus].background,
            }}
          >
            {viewer.registrationStatus}

            <LazyLoadImage
              alt="Registration status icon"
              src={listRegistrationStatuses[viewer.registrationStatus].icon}
              width={18}
              height={18}
            />
          </DropdownMenuLabel>
        )}

        <div className="flex flex-col gap-6 p-4">
          <DropdownMenuLabel className="flex gap-2 p-0">
            {viewer.accountId && (
              <AccountProfilePicture accountId={viewer.accountId} className="h-10 w-10" />
            )}

            <div className="flex flex-col">
              {profile?.name && <p className="font-semibold">{truncate(profile.name, 30)}</p>}

              {viewer.accountId && (
                <p className="prose color-[#656565] text-xs">{truncate(viewer.accountId, 30)}</p>
              )}
            </div>
          </DropdownMenuLabel>

          <DaoAuthForm />

          <div className="rounded-md border border-[#DBDBDB]">
            {viewer.accountId && (
              <Link href={`${rootPathnames.PROFILE}/${viewer.accountId}`}>
                <DropdownMenuItem className="px-3 py-2.5 font-medium">
                  {viewer.hasRegistrationApproved ? "My Project" : "My Profile"}
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
          onClick={logoutHandler}
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
