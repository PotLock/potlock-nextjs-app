import { useCallback } from "react";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { nearClient } from "@/common/api/near";
import { truncate } from "@/common/lib";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Skeleton,
} from "@/common/ui/components";
import { AccountProfilePicture } from "@/entities/_shared/account";
import { useSession } from "@/entities/_shared/session";
import { listRegistrationStatuses } from "@/entities/list";
import { rootPathnames } from "@/pathnames";

import { DaoAuth } from "./dao-auth";

// TODO: Finish refactoring
export const UserDropdown = () => {
  const authenticatedUser = useSession();

  const logoutHandler = useCallback(() => {
    nearClient.walletApi.wallet?.signOut();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 rounded-full">
        {authenticatedUser.isSignedIn ? (
          <AccountProfilePicture
            accountId={authenticatedUser.accountId}
            className="h-full w-full"
          />
        ) : (
          <Skeleton className="h-full w-full rounded-full" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 p-0">
        {authenticatedUser.registrationStatus && (
          <DropdownMenuLabel
            className="flex items-center justify-between px-4 py-2"
            style={{
              color: listRegistrationStatuses[authenticatedUser.registrationStatus].color,
              background: listRegistrationStatuses[authenticatedUser.registrationStatus].background,
            }}
          >
            {authenticatedUser.registrationStatus}

            <LazyLoadImage
              alt="Registration status icon"
              src={listRegistrationStatuses[authenticatedUser.registrationStatus].icon}
              width={18}
              height={18}
            />
          </DropdownMenuLabel>
        )}

        <div className="flex flex-col gap-6 p-4">
          <DropdownMenuLabel className="flex gap-2 p-0">
            {authenticatedUser.accountId && (
              <AccountProfilePicture
                accountId={authenticatedUser.accountId}
                className="h-10 w-10"
              />
            )}

            <div className="flex flex-col">
              {authenticatedUser.account?.near_social_profile_data?.name && (
                <p className="font-semibold">
                  {truncate(authenticatedUser.account?.near_social_profile_data?.name, 30)}
                </p>
              )}

              <p className="prose color-[#656565] text-xs">
                {truncate(authenticatedUser.accountId ?? "?", 38)}
              </p>
            </div>
          </DropdownMenuLabel>

          <DaoAuth />

          <div className="rounded-md border border-[#DBDBDB]">
            {authenticatedUser.accountId && (
              <Link href={`${rootPathnames.PROFILE}/${authenticatedUser.accountId}`}>
                <DropdownMenuItem className="px-3 py-2.5 font-medium">
                  {authenticatedUser.hasRegistrationApproved ? "My Project" : "My Profile"}
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
