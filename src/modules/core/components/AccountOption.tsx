import React, { useEffect, useState } from "react";

import { NEARSocialUserProfile } from "@/common/contracts/social";
import { AccountId, ByAccountId } from "@/common/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Skeleton,
} from "@/common/ui/components";

import { fetchSocialImages } from "../services/socialImages";

export type AccountOptionProps = ByAccountId &
  Pick<React.HTMLAttributes<HTMLDivElement>, "title"> & {
    isThumbnail?: boolean;
    onCheck?: (accountId: AccountId) => void;
    primaryAction?: React.ReactNode;
    secondaryAction?: React.ReactNode;
  };

export const AccountOption = ({
  isThumbnail = false,
  accountId,
  primaryAction,
  secondaryAction,
  title,
}: AccountOptionProps) => {
  const [profileImages, setProfileImages] = useState<Pick<
    NEARSocialUserProfile,
    "image" | "backgroundImage"
  > | null>(null);

  useEffect(() => {
    if (profileImages !== null) {
      fetchSocialImages({ accountId }).then(setProfileImages);
    }
  }, [accountId, profileImages]);

  const { image } = profileImages ?? {};

  const imageUrl =
    typeof image === "string"
      ? image
      : image?.url ??
        (image?.ipfs_cid
          ? `https://i.near.social/thumbnail/https://ipfs.near.social/ipfs/${image.ipfs_cid}`
          : null);

  const avatarElement = imageUrl ? (
    <Avatar className="h-10 w-10" {...{ title }}>
      <AvatarImage
        src={imageUrl}
        alt={`Avatar of ${accountId}`}
        width={40}
        height={40}
      />
      <AvatarFallback>{accountId}</AvatarFallback>
    </Avatar>
  ) : (
    <Skeleton className="h-10 w-10 rounded-full" {...{ title }} />
  );

  return isThumbnail ? (
    avatarElement
  ) : (
    <div un-flex="~" un-items="center" un-gap="4">
      {primaryAction}

      <div
        un-cursor="pointer"
        un-py="3"
        un-flex="~"
        un-items="center"
        un-gap="2"
      >
        {avatarElement}

        <span className="prose">{accountId}</span>
      </div>

      {secondaryAction}
    </div>
  );
};
