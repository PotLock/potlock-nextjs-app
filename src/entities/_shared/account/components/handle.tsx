import { useMemo } from "react";

import Link from "next/link";

import { ETHEREUM_EXPLORER_ADDRESS_ENDPOINT_URL } from "@/common/constants";
import { isEthereumAddress, truncate } from "@/common/lib";
import type { ByAccountId } from "@/common/types";
import { cn } from "@/common/ui/layout/utils";
import { rootPathnames } from "@/pathnames";

import { AccountSummaryPopup } from "./summary-popup";
import { useAccountSocialProfile } from "../hooks/social-profile";

export type AccountHandleProps = ByAccountId & {
  href?: string;
  maxLength?: number;
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

  console.log(truncate(accountId, maxLength));

  const content = useMemo(
    () =>
      asName && profile?.name
        ? truncate(profile?.name, maxLength)
        : `${isHandlePrefixHidden ? "" : "@"}${truncate(accountId, maxLength)}`,

    [accountId, asName, isHandlePrefixHidden, maxLength, profile?.name],
  );

  return (
    <AccountSummaryPopup disabled={isSummaryPopupDisabled} {...{ accountId }}>
      {linkHref === null ? (
        <span className="w-fit">{content}</span>
      ) : (
        <Link
          href={linkHref}
          target="blank"
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
