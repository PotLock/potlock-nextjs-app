import { useMemo } from "react";

import Link from "next/link";

import { ETHEREUM_EXPLORER_ADDRESS_ENDPOINT_URL } from "@/common/constants";
import { isEthereumAddress, truncate } from "@/common/lib";
import type { ByAccountId } from "@/common/types";
import { cn } from "@/common/ui/utils";
import { rootPathnames } from "@/pathnames";

import { AccountSummaryPopup } from "./AccountSummaryPopup";

export type AccountHandleProps = ByAccountId & {
  href?: string;
  disabledSummaryPopup?: boolean;
  className?: string;
};

export const AccountHandle: React.FC<AccountHandleProps> = ({
  accountId,
  href,
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

  return (
    <AccountSummaryPopup disabled={disabledSummaryPopup} {...{ accountId }}>
      <Link
        href={linkHref}
        target="blank"
        className={cn(
          "underline-dotted underline-neutral-500 underline-opacity-20 underline-offset-4",
          "hover:underline-solid hover:underline-opacity-100 underline",
          "max-w-100 inline-flex w-fit items-start text-nowrap text-neutral-500",
          className,
        )}
      >
        {`@${truncate(accountId, 32)}`}
      </Link>
    </AccountSummaryPopup>
  );
};
