import { useMemo } from "react";

import Link from "next/link";

import { ETHEREUM_EXPLORER_ADDRESS_ENDPOINT_URL } from "@/common/constants";
import { isEthereumAddress, truncate } from "@/common/lib";
import type { ByAccountId } from "@/common/types";
import { cn } from "@/common/ui/utils";
import { rootPathnames } from "@/pathnames";

import { AccountSummaryPopup } from "./AccountSummaryPopup";
import { useAccountSocialProfile } from "../hooks/social-profile";

export type AccountHandleProps = ByAccountId & {
  href?: string;
  asName?: boolean;
  disabledSummaryPopup?: boolean;
  className?: string;
};

export const AccountHandle: React.FC<AccountHandleProps> = ({
  accountId,
  href,
  asName = false,
  disabledSummaryPopup = false,
  className,
}) => {
  const linkHref = useMemo(
    () =>
      isEthereumAddress(accountId)
        ? `${ETHEREUM_EXPLORER_ADDRESS_ENDPOINT_URL}/${accountId}`
        : href || `${rootPathnames.PROFILE}/${accountId}`,

    [accountId, href],
  );

  // TODO: enable only if `asName`
  const { profile } = useAccountSocialProfile(accountId);

  return (
    <AccountSummaryPopup disabled={disabledSummaryPopup} {...{ accountId }}>
      <Link
        href={linkHref}
        target="blank"
        className={cn(
          "underline-neutral-500 underline-opacity-20 underline-offset-4",
          "hover:underline-opacity-100",
          "max-w-100 inline-flex w-fit items-start text-nowrap",

          {
            "hover:underline-solid font-semibold leading-normal hover:underline": asName,
            "hover:underline-solid underline-dotted text-neutral-500 underline": !asName,
          },
          className,
        )}
      >
        {asName && profile?.name ? truncate(profile?.name, 32) : `@${truncate(accountId, 32)}`}
      </Link>
    </AccountSummaryPopup>
  );
};
