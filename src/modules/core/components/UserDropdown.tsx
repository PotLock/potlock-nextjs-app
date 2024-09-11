import { useCallback, useEffect, useState } from "react";

import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { walletApi } from "@/common/api/near";
import { NEARSocialUserProfile } from "@/common/contracts/social";
import { getIsHuman } from "@/common/contracts/sybil.nadabot";
import { truncate } from "@/common/lib";
import { fetchSocialImages } from "@/common/services/near-socialdb";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Skeleton,
} from "@/common/ui/components";
import useWallet from "@/modules/auth/hooks/useWallet";
import { statusesIcons } from "@/modules/core/constants";
import useRegistration from "@/modules/core/hooks/useRegistration";
import routesPath from "@/modules/core/routes";
import { PROFILE_DEFAULTS } from "@/modules/profile/constants";
import {
  updateAccountId,
  updateNadabotVerification,
} from "@/modules/profile/utils";
import { useTypedSelector } from "@/store";

import ActAsDao from "./ActAsDao";

const ProfileImg = ({
  size,
  profileImg,
  setProfileImg,
}: {
  size: number;
  profileImg: string;
  setProfileImg: (value: string) => void;
}) => (
  <Image
    src={profileImg}
    width={size}
    height={size}
    onError={() => {
      setProfileImg(PROFILE_DEFAULTS.socialImages.image);
    }}
    className="rounded-full shadow-[0px_0px_0px_1px_rgba(199,199,199,0.22)_inset]"
    alt="profile-image"
  />
);

const DAOProfileImg = () => (
  <div className="flex h-[40px] w-[40px] justify-center rounded-full bg-[#292929] shadow-[0px_0px_0px_1px_rgba(199,199,199,0.22)_inset]">
    <Image
      src="/assets/icons/dao-address-icon.svg"
      width={17}
      height={17}
      alt="profile-image"
    />
  </div>
);

export const UserDropdown = () => {
  const [profileImg, setProfileImg] = useState("");
  const [profile, setProfile] = useState<NEARSocialUserProfile>({});

  const wallet = useWallet();
  const accountId = wallet?.wallet?.accountId || "";

  const { registration } = useRegistration(accountId);

  const [status, setStatus] = useState<string>(registration.status);

  const actAsDao = useTypedSelector((state) => state.nav.actAsDao);

  const logoutHandler = useCallback(() => {
    walletApi.wallet?.signOut();
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      const { image, profile } = await fetchSocialImages({
        accountId,
      });
      setProfileImg(image);
      setProfile(profile || {});
    };
    if (accountId) fetchProfileImage();

    // Add accountId to the nav model
    updateAccountId(accountId);
  }, [accountId]);

  useEffect(() => {
    // check if account verified on nadabot
    const fetchHumanStatus = async () => {
      if (accountId) {
        const isHuman = await getIsHuman({ account_id: accountId });
        updateNadabotVerification(isHuman);

        const status = registration.id
          ? registration.status
          : isHuman
            ? "Human"
            : "";

        setStatus(status);
      }
    };
    fetchHumanStatus();
  }, [accountId, registration]);

  const actAsDaoEnabled = actAsDao.toggle && actAsDao.defaultAddress;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        {profileImg ? (
          <>
            {actAsDaoEnabled ? (
              <DAOProfileImg />
            ) : (
              <ProfileImg
                size={32}
                profileImg={profileImg}
                setProfileImg={setProfileImg}
              />
            )}
          </>
        ) : (
          <Skeleton className="h-8 w-8 rounded-full" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="12px w-72 p-0">
        {status && (
          <DropdownMenuLabel
            className="flex items-center justify-between px-4 py-2"
            style={{
              color: statusesIcons[status]?.color,
              background: statusesIcons[status]?.background,
            }}
          >
            {registration.status}
            <Image
              src={statusesIcons[status]?.icon}
              width={18}
              height={18}
              alt="status-icon"
            />
          </DropdownMenuLabel>
        )}
        <div className="flex flex-col gap-6 p-4">
          <DropdownMenuLabel className="flex gap-2 p-0">
            {actAsDaoEnabled ? (
              <DAOProfileImg />
            ) : (
              <ProfileImg
                size={40}
                profileImg={profileImg}
                setProfileImg={setProfileImg}
              />
            )}
            <div className="flex flex-col">
              {profile?.name && (
                <p className="font-semibold">{truncate(profile?.name, 20)}</p>
              )}
              {actAsDaoEnabled ? (
                <p className="color-[#656565] text-xs">
                  {truncate(`Acting as ${actAsDao.defaultAddress}`, 36)}
                </p>
              ) : (
                <p className="color-[#656565] text-xs">
                  {truncate(accountId, 20)}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <ActAsDao />
          <div className="rounded-md border border-[#DBDBDB]">
            <Link href={`${routesPath.PROFILE}/${accountId}`}>
              <DropdownMenuItem className="px-3 py-[10px] font-medium">
                {registration ? "My Project" : "My user"}
              </DropdownMenuItem>
            </Link>
            <Link
              href={`https://near.social/mob.near/widget/NotificationFeed`}
              target="_blank"
            >
              <DropdownMenuItem className="px-3 py-[10px] font-medium">
                Notifications
              </DropdownMenuItem>
            </Link>
          </div>
        </div>
        <Button
          onClick={logoutHandler}
          variant="brand-plain"
          className="w-full justify-start bg-[#F7F7F7] px-4 py-3"
        >
          <LogOut color="#F6767A" /> Signout
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
