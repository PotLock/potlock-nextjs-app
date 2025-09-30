import { useMemo } from "react";

import Link from "next/link";

import { ETHEREUM_EXPLORER_ADDRESS_ENDPOINT_URL } from "@/common/constants";
import { isEthereumAddress, truncate } from "@/common/lib";
import type { ByAccountId } from "@/common/types";
import { cn } from "@/common/ui/layout/utils";
import { rootPathnames } from "@/navigation";

import { AccountSummaryPopup } from "./summary-popup";
import { useAccountSocialProfile } from "../hooks/social-profile";

export type AccountHandleProps = ByAccountId & {
  href?: string;

  /**
   * Maximum content length. `null` disables truncation.
   */
  maxLength?: number | null;

  asLink?: boolean;
  asName?: boolean;
  disabledSummaryPopup?: boolean;
  hiddenHandlePrefix?: boolean;
  className?: string;
};

export const AccountHandle: React.FC<AccountHandleProps> = ({
  accountId,
  maxLength = 32,
  href,
  asName = false,
  asLink = true,
  disabledSummaryPopup: isSummaryPopupDisabled = false,
  hiddenHandlePrefix: isHandlePrefixHidden = false,
  className,
}) => {
  const linkHref = useMemo(() => {
    if (asLink) {
      return isEthereumAddress(accountId)
        ? `${ETHEREUM_EXPLORER_ADDRESS_ENDPOINT_URL}/${accountId}`
        : href || `${rootPathnames.PROFILE}/${accountId}`;
    } else return null;
  }, [accountId, asLink, href]);

  const { profile } = useAccountSocialProfile({ enabled: asName, accountId });

  const { content, isTruncated } = useMemo(() => {
    const isName = asName && profile?.name;
    const isTruncated = maxLength !== null && (profile?.name ?? accountId).length > maxLength;

    if (maxLength === null) {
      return {
        content: isName ? profile.name : `${isHandlePrefixHidden ? "" : "@"}${accountId}`,
        isTruncated,
      };
    } else {
      return {
        content: isName
          ? truncate(profile?.name as string, maxLength)
          : truncate(`${(isHandlePrefixHidden ? "" : "@") + accountId}`, maxLength),

        isTruncated,
      };
    }
  }, [accountId, asName, isHandlePrefixHidden, maxLength, profile?.name]);

  return (
    <AccountSummaryPopup disabled={isSummaryPopupDisabled} {...{ accountId }}>
      {linkHref === null ? (
        <span
          title={isSummaryPopupDisabled && isTruncated ? accountId : undefined}
          className={cn("w-fit", className)}
        >
          {content}
        </span>
      ) : (
        <Link
          href={linkHref}
          target="_blank"
          title={isSummaryPopupDisabled && isTruncated ? accountId : undefined}
          className={cn(
            "underline-neutral-500 underline-opacity-20 underline-offset-4",
            "hover:underline-opacity-100",
            "max-w-100 inline-flex w-fit items-start whitespace-nowrap text-nowrap",

            {
              "hover:underline-solid font-semibold leading-normal hover:underline": asName,
              "hover:underline-solid underline-dotted text-neutral-500 underline": !asName,
            },

            className,
          )}
        >
          {content}
        </Link>
      )}
    </AccountSummaryPopup>
  );
};
