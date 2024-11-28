import { useCallback, useEffect, useState } from "react";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { walletApi } from "@/common/api/near";
import { RegistrationStatus } from "@/common/contracts/core";
import { getIsHuman } from "@/common/contracts/core/sybil";
import { NEARSocialUserProfile } from "@/common/contracts/social";
import { truncate } from "@/common/lib";
import { fetchSocialImages } from "@/common/services/near-socialdb";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import useWallet from "@/modules/auth/hooks/wallet";
import { AccountProfilePicture, useRegistration } from "@/modules/core";
import routesPath from "@/modules/core/routes";
import { ListRegistrationStatus, listRegistrationStatuses } from "@/modules/lists";
import { updateAccountId, updateNadabotVerification } from "@/modules/profile/utils";
import { useGlobalStoreSelector } from "@/store";

import ActAsDao from "./ActAsDao";

const daoProfileImage = (
  <div
    className={cn(
      "flex h-10 w-10 justify-center rounded-full bg-[#292929]",
      "shadow-[0px_0px_0px_1px_rgba(199,199,199,0.22)_inset]",
    )}
  >
    <LazyLoadImage
      alt="DAO profile image"
      src="/assets/icons/dao-address-icon.svg"
      width={17}
      height={17}
    />
  </div>
);

export const UserDropdown = () => {
  const [profile, setProfile] = useState<NEARSocialUserProfile>({});
  const wallet = useWallet();
  const accountId = wallet?.wallet?.accountId || "";
  const { registration } = useRegistration(accountId);
  const actAsDao = useGlobalStoreSelector((state) => state.nav.actAsDao);

  const [status, setStatus] = useState<ListRegistrationStatus>(registration.status);

  const logoutHandler = useCallback(() => {
    walletApi.wallet?.signOut();
  }, []);

  useEffect(() => {
    if (accountId) {
      fetchSocialImages({ accountId }).then(({ profile }) => setProfile(profile ?? {}));
    }

    // Add accountId to the nav model
    updateAccountId(accountId);
  }, [accountId]);

  useEffect(() => {
    if (accountId) {
      getIsHuman({ account_id: accountId }).then((isHuman) => {
        updateNadabotVerification(isHuman);

        setStatus(
          (registration.id ? registration.status : undefined) ??
            (isHuman ? "Human" : RegistrationStatus.Unregistered),
        );
      });
    }
  }, [accountId, registration]);

  const actAsDaoEnabled = actAsDao.toggle && actAsDao.defaultAddress;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 rounded-full">
        {actAsDaoEnabled ? (
          daoProfileImage
        ) : (
          <AccountProfilePicture accountId={accountId} className="h-full w-full" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 p-0">
        {status && (
          <DropdownMenuLabel
            className="flex items-center justify-between px-4 py-2"
            style={{
              color: listRegistrationStatuses[status].color,
              background: listRegistrationStatuses[status].background,
            }}
          >
            {registration.status}

            <LazyLoadImage
              alt="Registration status icon"
              src={listRegistrationStatuses[status].icon}
              width={18}
              height={18}
            />
          </DropdownMenuLabel>
        )}

        <div className="flex flex-col gap-6 p-4">
          <DropdownMenuLabel className="flex gap-2 p-0">
            {actAsDaoEnabled ? (
              daoProfileImage
            ) : (
              <AccountProfilePicture accountId={accountId} className="h-10 w-10" />
            )}

            <div className="flex flex-col">
              {profile?.name && <p className="font-semibold">{truncate(profile?.name, 30)}</p>}

              {actAsDaoEnabled ? (
                <p className="color-[#656565] text-xs">
                  {truncate(`Acting as ${actAsDao.defaultAddress}`, 36)}
                </p>
              ) : (
                <p className="prose color-[#656565] text-xs">{truncate(accountId, 40)}</p>
              )}
            </div>
          </DropdownMenuLabel>

          <ActAsDao />

          <div className="rounded-md border border-[#DBDBDB]">
            <Link href={`${routesPath.PROFILE}/${accountId}`}>
              <DropdownMenuItem className="px-3 py-2.5 font-medium">
                {registration ? "My Project" : "My Profile"}
              </DropdownMenuItem>
            </Link>

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
