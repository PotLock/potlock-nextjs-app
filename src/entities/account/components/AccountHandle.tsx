import { useCallback, useEffect, useMemo, useState } from "react";

import { MiddleTruncate } from "@re-dev/react-truncate";
import { useWindowSize } from "@uidotdev/usehooks";
import Link from "next/link";

import type { ByAccountId } from "@/common/types";
import { cn } from "@/common/ui/utils";
import { rootPathnames } from "@/pathnames";

import { AccountSummaryPopup } from "./AccountSummaryPopup";

export type AccountHandleProps = ByAccountId & {
  href?: string;
  disableSummaryPopup?: boolean;
  className?: string;
};

export const AccountHandle: React.FC<AccountHandleProps> = ({
  accountId,
  href,
  disableSummaryPopup = false,
  className,
}) => {
  const currentWindowSize = useWindowSize();
  const [initialWindowSize, setInitialWindowSize] = useState(currentWindowSize);
  const [initialDisableSummaryPopup, setInitialDisableSummaryPopup] = useState(disableSummaryPopup);
  const [isTruncated, setIsTruncated] = useState(false);

  const registerTruncate = useCallback(() => {
    setTimeout(() => {
      setIsTruncated(true);
    }, 1500);
  }, []);

  useEffect(() => {
    /**
     * We need to temporarily set the wrapper element's width back to `w-full`
     *  when the window size changes, so that the `MiddleTruncate` component
     *  can re-calculate its width correctly, after which we're free to set `w-fit`
     *  ( see Link's conditional className fragment )
     */
    if (currentWindowSize.width !== initialWindowSize.width) {
      setInitialWindowSize(currentWindowSize);
      setIsTruncated(false);
    }

    /**
     * Hack to mitigate the collapse of `MiddleTruncate` component
     *  when `disableSummaryPopup` is changed is runtime.
     */
    if (disableSummaryPopup !== initialDisableSummaryPopup) {
      setInitialDisableSummaryPopup(disableSummaryPopup);
      setIsTruncated(false);
    }
  }, [initialWindowSize, currentWindowSize, disableSummaryPopup, initialDisableSummaryPopup]);

  return (
    <AccountSummaryPopup disabled={disableSummaryPopup} {...{ accountId }}>
      <Link
        className={cn(
          "underline-dotted underline-neutral-500 underline-opacity-20 underline-offset-4",
          "hover:underline-solid hover:underline-opacity-100 underline",
          "max-w-100 inline-flex items-start text-nowrap text-neutral-500",

          /* See comments in `useEffect` */
          { "w-full": !isTruncated, "w-fit": isTruncated },

          className,
        )}
        href={href || `${rootPathnames.PROFILE}/${accountId}`}
        target="_blank"
      >
        <MiddleTruncate end={0} onTruncate={registerTruncate}>{`@${accountId}`}</MiddleTruncate>
      </Link>
    </AccountSummaryPopup>
  );
};
