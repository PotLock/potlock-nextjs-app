import { useCallback } from "react";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { nearProtocolClient } from "@/common/blockchains/near-protocol";
import { NOOP_STRING } from "@/common/constants";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import {
  AccountHandle,
  AccountProfilePicture,
  useAccountSocialProfile,
} from "@/entities/_shared/account";
import { listRegistrationStatuses } from "@/entities/list";
import { DaoAuthMenu } from "@/features/dao-auth";
import { routeSelectors } from "@/pathnames";

export const UserMenu: React.FC = () => {
  const walletUser = useWalletUserSession();

  const { profile } = useAccountSocialProfile({
    enabled: walletUser.isSignedIn,
    live: true,
    accountId: walletUser.signerAccountId ?? NOOP_STRING,
  });

  const onSignInClick = useCallback(() => {
    nearProtocolClient.walletApi.signInModal();
  }, []);

  return !walletUser.isSignedIn ? (
    <Button
      font="semibold"
      variant="standard-filled"
      onClick={onSignInClick}
      className="border-none bg-[#342823] shadow-none"
    >
      {"Sign In"}
    </Button>
  ) : (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="h-8 w-8 rounded-full">
          <AccountProfilePicture accountId={walletUser.accountId} className="h-full w-full" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="md:w-100 max-w-100 w-screen p-0">
          {walletUser.registrationStatus && (
            <div
              className="flex items-center justify-between px-4 py-2 text-sm font-semibold"
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
            </div>
          )}

          <div className="flex flex-col gap-6 p-4">
            <DropdownMenuLabel className="flex flex-col gap-2 p-0">
              <div className="flex gap-2">
                <AccountProfilePicture
                  accountId={walletUser.signerAccountId}
                  className="h-10 w-10"
                />

                <div className="flex flex-col">
                  {profile?.name && (
                    <AccountHandle
                      accountId={walletUser.signerAccountId}
                      asLink={false}
                      asName
                      disabledSummaryPopup
                      maxLength={null}
                      className="font-semibold"
                    />
                  )}

                  <AccountHandle
                    accountId={walletUser.signerAccountId}
                    asLink={false}
                    disabledSummaryPopup
                    maxLength={null}
                    className={cn({
                      "color-neutral-600 text-xs": profile?.name !== undefined,
                    })}
                  />
                </div>
              </div>
            </DropdownMenuLabel>

            <DaoAuthMenu memberAccountId={walletUser.signerAccountId} />

            <div className="rounded-md border border-[#DBDBDB]">
              <DropdownMenuItem asChild className="px-3 py-2.5 font-medium">
                <Link href={routeSelectors.PROFILE_BY_ID(walletUser.signerAccountId)}>
                  {"My Profile"}
                </Link>
              </DropdownMenuItem>

              {walletUser.isDaoRepresentative && (
                <DropdownMenuItem asChild className="px-3 py-2.5 font-medium">
                  <Link href={routeSelectors.PROFILE_BY_ID(walletUser.accountId)}>
                    {"DAO Profile"}
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem asChild className="px-3 py-2.5 font-medium">
                <Link href={`https://near.social/mob.near/widget/NotificationFeed`} target="_blank">
                  {"Notifications"}
                </Link>
              </DropdownMenuItem>
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
    </>
  );
};
