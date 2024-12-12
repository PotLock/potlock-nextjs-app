import { useMemo } from "react";

import Link from "next/link";

import { AccountId, ByAccountId } from "@/common/types";
import { Avatar, AvatarImage, Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { useProfileData } from "@/entities/profile";
import { rootPathnames } from "@/pathnames";

export type AccountOptionProps = ByAccountId &
  Pick<React.HTMLAttributes<HTMLDivElement>, "title"> & {
    isRounded?: boolean;
    isThumbnail?: boolean;
    highlightOnHover?: boolean;
    onCheck?: (accountId: AccountId) => void;
    primaryAction?: React.ReactNode;
    secondaryAction?: React.ReactNode;
    accountLink?: string;

    classNames?: {
      root?: string;
      avatar?: string;
    };
  };

export const AccountOption = ({
  isRounded = false,
  isThumbnail = false,
  highlightOnHover = false,
  accountId,
  primaryAction,
  secondaryAction,
  accountLink,
  title,
  classNames,
}: AccountOptionProps) => {
  const { profileImages, profile, profileReady } = useProfileData(accountId);

  const avatarSrc = useMemo(
    () =>
      (typeof profile?.image === "string" ? profile?.image : profile?.image?.url) ??
      profileImages.image,

    [profile?.image, profileImages.image],
  );

  const avatarElement = useMemo(
    () =>
      profileReady ? (
        <Avatar className={cn("h-10 w-10", classNames?.avatar)} {...{ title }}>
          <AvatarImage src={avatarSrc} alt={`Avatar of ${accountId}`} width={40} height={40} />
        </Avatar>
      ) : (
        <Skeleton className={cn("h-10 w-10 rounded-full", classNames?.avatar)} {...{ title }} />
      ),

    [accountId, avatarSrc, classNames?.avatar, profileReady, title],
  );

  return isThumbnail ? (
    avatarElement
  ) : (
    <div
      className={cn(
        "flex w-full items-center gap-4 px-5 py-2",
        { "rounded-full": isRounded, "hover:bg-neutral-50": highlightOnHover },
        classNames?.root,
      )}
    >
      {primaryAction}

      <div un-cursor="pointer" un-flex="~" un-items="center" un-gap="4">
        {avatarElement}

        <div className="flex flex-col">
          <span className="prose font-600">{profile?.name ?? accountId}</span>

          <Link
            className="underline-solid inline-flex items-center text-neutral-500 underline underline-offset-4"
            href={accountLink ? `${accountLink}` : `${rootPathnames.PROFILE}/${accountId}`}
            target="_blank"
          >
            <span className="prose">{`@${accountId}`}</span>
          </Link>
        </div>
      </div>

      {secondaryAction && <div className="ml-auto">{secondaryAction}</div>}
    </div>
  );
};
