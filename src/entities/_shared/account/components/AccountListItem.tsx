import { useCallback, useMemo } from "react";

import { truncate } from "@/common/lib";
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
  disableHandleSummaryPopup?: boolean;
  primarySlot?: React.ReactNode;
  secondarySlot?: React.ReactNode;
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
  disableHandleSummaryPopup = false,
  primarySlot,
  secondarySlot,
  href,
  onClick,
  classNames,
}: AccountListItemProps) => {
  const handleClick = useCallback((): void => void onClick?.(accountId), [accountId, onClick]);
  const { profile } = useAccountSocialProfile({ accountId });

  const avatarElement = useMemo(
    () => (
      <AccountSummaryPopup {...{ accountId }}>
        <div className="flex h-fit min-h-fit w-fit min-w-fit">
          <AccountProfilePicture
            className={cn("h-10 min-h-10 w-10 min-w-10", classNames?.avatar)}
            {...{ accountId }}
          />
        </div>
      </AccountSummaryPopup>
    ),

    [accountId, classNames?.avatar],
  );

  return isThumbnail ? (
    avatarElement
  ) : (
    <div
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-4 py-2 hover:bg-transparent",
        { "rounded-full": isRounded, "hover:bg-[#FEF6EE]": highlightOnHover },
        classNames?.root,
      )}
    >
      {primarySlot}

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
              <span className="w-fit">{truncate(profile?.name ?? accountId, 38)}</span>
            </AccountSummaryPopup>

            {statusElement && (
              <div className={cn("hidden md:block", { "md:hidden": hideStatusOnDesktop })}>
                {statusElement}
              </div>
            )}
          </div>

          <div className="max-w-100 flex w-full flex-col gap-1.5">
            <AccountHandle
              disabledSummaryPopup={disableHandleSummaryPopup}
              accountId={accountId}
              href={href}
            />

            {statusElement && (
              <span className={cn("md:hidden", { hidden: hideStatusOnMobile })}>
                {statusElement}
              </span>
            )}
          </div>
        </div>
      </div>

      {secondarySlot && <div className="">{secondarySlot}</div>}
    </div>
  );
};
