import { useCallback, useMemo } from "react";

import { MiddleTruncate } from "@re-dev/react-truncate";

import { AccountId, ByAccountId } from "@/common/types";
import { cn } from "@/common/ui/utils";

import { AccountHandle } from "./AccountHandle";
import { AccountSummaryPopup } from "./AccountSummaryPopup";
import { AccountProfilePicture } from "./profile-images";
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
  const { profile } = useAccountSocialProfile(accountId);

  const avatarElement = useMemo(
    () => (
      <AccountProfilePicture className={cn("h-10 w-10", classNames?.avatar)} {...{ accountId }} />
    ),

    [accountId, classNames?.avatar],
  );

  return isThumbnail ? (
    avatarElement
  ) : (
    <div
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-4 py-2 hover:bg-transparent md:py-0",
        { "rounded-full": isRounded, "hover:bg-[#FEF6EE]": highlightOnHover },
        classNames?.root,
      )}
    >
      {primaryAction}

      <div className="mr-a flex w-full items-center gap-4">
        {avatarElement}

        <div className="max-w-100 flex w-full flex-col items-start justify-start">
          <div
            className={cn("inline-flex w-full items-start gap-1.5", {
              "max-w-100": !statusElement,
              "max-w-150": Boolean(statusElement),
            })}
          >
            <AccountSummaryPopup {...{ accountId }}>
              <MiddleTruncate className="font-600 w-full self-start" end={0}>
                {profile?.name ?? accountId}
              </MiddleTruncate>
            </AccountSummaryPopup>

            {statusElement && (
              <div className={cn("hidden md:block", { "md:hidden": hideStatusOnDesktop })}>
                {statusElement}
              </div>
            )}
          </div>

          <div className="max-w-100 flex w-full flex-col gap-1.5">
            <AccountHandle {...{ accountId, href }} />

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
