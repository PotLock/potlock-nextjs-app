import { useMemo } from "react";

import { MiddleTruncate } from "@re-dev/react-truncate";
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
    statusElement?: React.ReactNode;
    hideStatusOnDesktop?: boolean;
    hideStatusOnMobile?: boolean;
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
  statusElement,
  hideStatusOnDesktop = false,
  hideStatusOnMobile = false,
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

      <div className="mr-a flex w-full cursor-pointer items-center gap-4">
        {avatarElement}

        <div className="flex w-full flex-col">
          <div className="font-600 inline-flex items-center">
            <MiddleTruncate className="font-600" end={0}>
              {profile?.name ?? accountId}
            </MiddleTruncate>

            <div className={cn("hidden md:block", { "md:hidden": hideStatusOnDesktop })}>
              {statusElement}
            </div>
          </div>

          <Link
            className={cn(
              "underline-solid inline-flex w-full items-center",
              "text-nowrap text-neutral-500 underline underline-offset-4",
            )}
            href={accountLink ? `${accountLink}` : `${rootPathnames.PROFILE}/${accountId}`}
            target="_blank"
          >
            <MiddleTruncate end={0}>{`@${accountId}`}</MiddleTruncate>
          </Link>

          {statusElement && (
            <span className={cn("mt-2 md:hidden", { hidden: hideStatusOnMobile })}>
              {statusElement}
            </span>
          )}
        </div>
      </div>

      {secondaryAction && <div className="">{secondaryAction}</div>}
    </div>
  );
};
