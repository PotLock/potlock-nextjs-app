import { useCallback, useMemo } from "react";

import { MiddleTruncate } from "@re-dev/react-truncate";
import Link from "next/link";

import { AccountId, ByAccountId } from "@/common/types";
import { Avatar, AvatarImage, Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { rootPathnames } from "@/pathnames";

import { AccountSummaryPopup } from "./AccountSummaryPopup";
import { useAccountSocialProfile } from "../hooks/social-profile";

export type AccountListItemProps = ByAccountId & {
  isRounded?: boolean;
  isThumbnail?: boolean;
  highlightOnHover?: boolean;
  statusElement?: React.ReactNode;
  hideStatusOnDesktop?: boolean;
  hideStatusOnMobile?: boolean;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  href?: string;
  onClick?: (accountId: AccountId) => void;

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
  href,
  onClick,
  classNames,
}: AccountListItemProps) => {
  const handleClick = useCallback((): void => void onClick?.(accountId), [accountId, onClick]);
  const { profile, isReady, avatarSrc } = useAccountSocialProfile(accountId);

  const avatarElement = useMemo(
    () =>
      isReady ? (
        <Avatar className={cn("h-10 w-10", classNames?.avatar)}>
          <AvatarImage src={avatarSrc} alt={`Avatar of ${accountId}`} width={40} height={40} />
        </Avatar>
      ) : (
        <Skeleton className={cn("h-10 w-10 rounded-full", classNames?.avatar)} />
      ),

    [accountId, avatarSrc, classNames?.avatar, isReady],
  );

  return isThumbnail ? (
    <AccountSummaryPopup {...{ accountId }}>{avatarElement}</AccountSummaryPopup>
  ) : (
    <div
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-4 hover:bg-transparent",
        { "rounded-full": isRounded, "hover:bg-[#FEF6EE]": highlightOnHover },
        classNames?.root,
      )}
    >
      {primaryAction}

      <AccountSummaryPopup {...{ accountId }}>
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

            <div className="max-w-100 flex w-full flex-col gap-1.5">
              <Link
                className={cn(
                  "underline-solid max-w-100 inline-flex w-full items-start",
                  "text-nowrap text-neutral-500 underline-offset-4",
                )}
                href={href || `${rootPathnames.PROFILE}/${accountId}`}
                target="_blank"
              >
                <MiddleTruncate end={0}>{`@${accountId}`}</MiddleTruncate>
              </Link>

              {statusElement && (
                <span className={cn("md:hidden", { hidden: hideStatusOnMobile })}>
                  {statusElement}
                </span>
              )}
            </div>
          </div>
        </div>
      </AccountSummaryPopup>

      {secondaryAction && <div className="">{secondaryAction}</div>}
    </div>
  );
};
