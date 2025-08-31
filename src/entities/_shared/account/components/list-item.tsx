import { useCallback, useMemo } from "react";

import { AccountId, ByAccountId } from "@/common/types";
import { cn } from "@/common/ui/layout/utils";

import { AccountHandle, type AccountHandleProps } from "./handle";
import { AccountProfilePicture } from "./profile-images";
import { AccountSummaryPopup } from "./summary-popup";

export type AccountListItemProps = ByAccountId & {
  isRounded?: boolean;
  isThumbnail?: boolean;
  highlightOnHover?: boolean;
  statusElement?: React.ReactNode;
  hideStatusOnDesktop?: boolean;
  hideStatusOnMobile?: boolean;
  disableHandleSummaryPopup?: boolean;
  disableNameSummaryPopup?: boolean;
  maxTextLength?: AccountHandleProps["maxLength"];
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
  disableNameSummaryPopup = false,
  maxTextLength,
  primarySlot,
  secondarySlot,
  href,
  onClick,
  classNames,
}: AccountListItemProps) => {
  const handleClick = useCallback((): void => void onClick?.(accountId), [accountId, onClick]);

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
            <AccountHandle
              accountId={accountId}
              asName
              disabledSummaryPopup={disableNameSummaryPopup}
              maxLength={maxTextLength ?? 38}
              className="font-normal"
            />

            {statusElement && (
              <div className={cn("hidden md:block", { "md:hidden": hideStatusOnDesktop })}>
                {statusElement}
              </div>
            )}
          </div>

          <div className="max-w-100 flex w-full flex-col gap-1.5">
            <AccountHandle
              accountId={accountId}
              disabledSummaryPopup={disableHandleSummaryPopup}
              maxLength={maxTextLength}
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
