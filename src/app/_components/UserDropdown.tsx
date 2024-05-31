import React, { useCallback, useEffect, useState } from "react";

import Image from "next/image";

import { walletApi } from "@/common/contracts";
import { getImage } from "@/common/lib";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/common/ui/components/dropdown-menu";
import { Skeleton } from "@/common/ui/components/skeleton";
import useWallet from "@/modules/auth/hooks/useWallet";
import useRegistration from "@/modules/core/hooks/useRegistration";
import { DEFAULT_USER } from "@/modules/profile/constants";

import { dispatch } from "../_store";

const UserDropdown = () => {
  const [profileImg, setProfileImg] = useState("");

  const wallet = useWallet();

  const accountId = wallet?.wallet?.accountId || "";

  const { registration, loading } = useRegistration(accountId);

  const logoutHandler = useCallback(() => {
    walletApi.wallet?.signOut();
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      const profileImage = await getImage({
        accountId,
        type: "image",
      });
      setProfileImg(profileImage);
    };
    fetchProfileImage();
  }, [accountId]);

  useEffect(() => {
    //   Add accountId to the nav model
    dispatch.nav.updateAccountId(accountId);
  }, [accountId]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {profileImg ? (
          <Image
            src={profileImg}
            width={32}
            height={32}
            onError={() => {
              setProfileImg(DEFAULT_USER.profileImages.image);
            }}
            className="rounded-full shadow-[0px_0px_0px_1px_rgba(199,199,199,0.22)_inset]"
            alt="profile-image"
          />
        ) : (
          <Skeleton className="h-8 w-8 rounded-full" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
