import { useMemo } from "react";

import { MiddleTruncate } from "@re-dev/react-truncate";
import Link from "next/link";

import { AccountId, ByAccountId } from "@/common/types";
import {
  Avatar,
  AvatarImage,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/common/ui/components";
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
    daysAgoData?: number;
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
  title,
  daysAgoData,
  classNames,
  accountLink,
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

  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          className="address"
          href={accountLink ? `${accountLink}` : `/profile/${accountId}`}
          target="_blank"
        >
          {isThumbnail ? (
            avatarElement
          ) : (
            <div
              className={cn(
                "flex w-full cursor-pointer items-center gap-4 hover:bg-transparent",
                { "rounded-full": isRounded, "hover:bg-[#FEF6EE]": highlightOnHover },
                classNames?.root,
              )}
            >
              {primaryAction}

              <div className="mr-a flex w-full cursor-pointer items-center gap-4">
                {avatarElement}

                <div className="flex w-full flex-col">
                  <MiddleTruncate className="font-600 w-full" end={0}>
                    {profile?.name ?? accountId}
                  </MiddleTruncate>

                  <Link
                    className={cn(
                      "underline-solid inline-flex w-full items-start",
                      "text-nowrap text-neutral-500 underline-offset-4",
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
          )}
        </Link>
      </TooltipTrigger>
      <TooltipContent>{accountId}</TooltipContent>
    </Tooltip>
  );
};
