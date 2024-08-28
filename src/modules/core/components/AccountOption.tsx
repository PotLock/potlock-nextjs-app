import { useMemo } from "react";

import { AccountId, ByAccountId } from "@/common/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Skeleton,
} from "@/common/ui/components";
import { useProfileData } from "@/modules/profile";

export type AccountOptionProps = ByAccountId &
  Pick<React.HTMLAttributes<HTMLDivElement>, "title"> & {
    isThumbnail?: boolean;
    onCheck?: (accountId: AccountId) => void;
    primaryAction?: React.ReactNode;
    secondaryAction?: React.ReactNode;
  };

const NO_IMAGE =
  "https://i.near.social/magic/large/https://near.social/magic/img/account/null.near";

export const AccountOption = ({
  isThumbnail = false,
  accountId,
  primaryAction,
  secondaryAction,
  title,
}: AccountOptionProps) => {
  const { profileImages, profileReady } = useProfileData(accountId);

  const avatarElement = useMemo(
    () =>
      profileReady ? (
        <Avatar className="h-10 w-10" {...{ title }}>
          <AvatarImage
            src={profileImages.image}
            alt={`Avatar of ${accountId}`}
            width={40}
            height={40}
          />

          <AvatarFallback>
            <AvatarImage
              src={NO_IMAGE}
              alt={`${accountId} does not have an avatar`}
              width={40}
              height={40}
            />
          </AvatarFallback>
        </Avatar>
      ) : (
        <Skeleton className="h-10 w-10 rounded-full" {...{ title }} />
      ),

    [accountId, profileImages.image, profileReady, title],
  );

  return isThumbnail ? (
    avatarElement
  ) : (
    <div
      un-flex="~"
      un-items="center"
      un-gap="4"
      un-w="full"
      un-p="y-3 x-5"
      un-bg="hover:[#FEF6EE]"
    >
      {primaryAction}

      <div un-cursor="pointer" un-flex="~" un-items="center" un-gap="2">
        {avatarElement}

        <span className="prose">{accountId}</span>
      </div>

      {secondaryAction}
    </div>
  );
};
