import { useMemo } from "react";

import { AccountId, ByAccountId } from "@/common/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Skeleton,
} from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { useProfileData } from "@/modules/profile";

export type AccountOptionProps = ByAccountId &
  Pick<React.HTMLAttributes<HTMLDivElement>, "title"> & {
    isRounded?: boolean;
    isThumbnail?: boolean;
    onCheck?: (accountId: AccountId) => void;
    primaryAction?: React.ReactNode;
    secondaryAction?: React.ReactNode;

    classNames?: {
      root?: string;
      avatar?: string;
    };
  };

const NO_IMAGE =
  "https://i.near.social/magic/large/https://near.social/magic/img/account/null.near";

export const AccountOption = ({
  isRounded = false,
  isThumbnail = false,
  accountId,
  primaryAction,
  secondaryAction,
  title,
  classNames,
}: AccountOptionProps) => {
  const { profileImages, profileReady } = useProfileData(accountId);

  const avatarElement = useMemo(
    () =>
      profileReady ? (
        <Avatar className={cn("h-10 w-10", classNames?.avatar)} {...{ title }}>
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
        <Skeleton
          className={cn("h-10 w-10 rounded-full", classNames?.avatar)}
          {...{ title }}
        />
      ),

    [accountId, classNames?.avatar, profileImages.image, profileReady, title],
  );

  return isThumbnail ? (
    avatarElement
  ) : (
    <div
      className={cn(
        "flex w-full items-center gap-4 px-5 py-2 hover:bg-[#FEF6EE]",
        { "rounded-full": isRounded },
        classNames?.root,
      )}
    >
      {primaryAction}

      <div un-cursor="pointer" un-flex="~" un-items="center" un-gap="2">
        {avatarElement}

        <span className="prose">{accountId}</span>
      </div>

      {secondaryAction && <div className="ml-auto">{secondaryAction}</div>}
    </div>
  );
};
