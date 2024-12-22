import { useMemo } from "react";

import { MiddleTruncate } from "@re-dev/react-truncate";
import Link from "next/link";

import { AccountId, ByAccountId } from "@/common/types";
import { Avatar, AvatarImage, Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { rootPathnames } from "@/pathnames";

import { AccountSummaryPopup } from "./AccountSummaryPopup";
import { useAccountSocialProfile } from "../hooks/social-profile";

export type AccountListItemProps = ByAccountId &
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

export const AccountListItem = ({
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
  classNames,
  accountLink,
}: AccountListItemProps) => {
  const { profileImages, profile, profileReady } = useAccountSocialProfile(accountId);

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
        "flex w-full items-center gap-4 hover:bg-transparent",
        { "rounded-full": isRounded, "hover:bg-[#FEF6EE]": highlightOnHover },
        classNames?.root,
      )}
    >
      {primaryAction}

      <div className="mr-a flex w-full items-center gap-4">
        {avatarElement}

        <div className="flex w-full flex-col items-start justify-start">
          <div className="max-w-100 inline-flex w-full items-start gap-1.5">
            <MiddleTruncate className="font-600 w-full self-start" end={0}>
              {profile?.name ?? accountId}
            </MiddleTruncate>

            <div className={cn("hidden md:block", { "md:hidden": hideStatusOnDesktop })}>
              {statusElement}
            </div>
          </div>

          <div className="flex w-full flex-col gap-1.5">
            <AccountSummaryPopup {...{ accountId }}>
              <Link
                className={cn(
                  "underline-solid max-w-100 inline-flex w-full items-start",
                  "text-nowrap text-neutral-500 underline-offset-4",
                )}
                href={accountLink || `${rootPathnames.PROFILE}/${accountId}`}
                target="_blank"
              >
                <MiddleTruncate end={0}>{`@${accountId}`}</MiddleTruncate>
              </Link>
            </AccountSummaryPopup>

            {statusElement && (
              <span className={cn("md:hidden", { hidden: hideStatusOnMobile })}>
                {statusElement}
              </span>
            )}
          </div>
        </div>
      </div>

      {secondaryAction && <div className="">{secondaryAction}</div>}
    </div>
  );
};
