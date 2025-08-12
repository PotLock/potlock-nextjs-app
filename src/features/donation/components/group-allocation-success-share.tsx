import { useMemo } from "react";

import Link from "next/link";

import {
  APP_DEFAULT_PUBLIC_URL,
  DEFAULT_SHARE_HASHTAGS,
  PLATFORM_TWITTER_ACCOUNT_ID,
  X_INTENT_URL_BASE,
} from "@/common/constants";
import type { AccountId } from "@/common/types";
import { Button, Skeleton } from "@/common/ui/layout/components";
import TwitterSvg from "@/common/ui/layout/svg/twitter";
import { useWalletUserSession } from "@/common/wallet";
import { rootPathnames } from "@/pathnames";

export type DonationGroupAllocationSuccessXShareButtonProps = {
  recipientAccountIds: AccountId[];
};

export const DonationGroupAllocationSuccessXShareButton: React.FC<
  DonationGroupAllocationSuccessXShareButtonProps
> = ({ recipientAccountIds }) => {
  const walletUser = useWalletUserSession();

  const intent = useMemo(() => {
    const text = encodeURIComponent(
      `🎉 Just supported ${recipientAccountIds.length} projects through @${
        PLATFORM_TWITTER_ACCOUNT_ID
      }!\n\n` +
        "💝 Making an impact by funding public goods that shape our future." +
        `\n\n🤝 Join me in supporting amazing projects:\n`,
    );

    const baseUrl = `${
      APP_DEFAULT_PUBLIC_URL
    }${rootPathnames.PROFILE}/${walletUser.accountId}/donations`;

    const fullUrl = walletUser.isSignedIn
      ? `${baseUrl}?referrerAccountId=${walletUser.accountId}`
      : baseUrl;

    const encodedUrl = encodeURIComponent(fullUrl);
    const encodedRelation = encodeURIComponent(APP_DEFAULT_PUBLIC_URL);

    return (
      X_INTENT_URL_BASE +
      text +
      `&url=${encodedUrl}` +
      `&related=${encodedRelation}` +
      `&hashtags=${DEFAULT_SHARE_HASHTAGS.join(",")}`
    );
  }, [recipientAccountIds.length, walletUser.accountId, walletUser.isSignedIn]);

  return !walletUser.hasWalletReady || !walletUser.isSignedIn ? (
    <Skeleton className="w-41 h-4.5" />
  ) : (
    <Button asChild variant="standard-filled" className="bg-neutral-950 py-1.5 shadow-none">
      <Link href={intent} target="_blank">
        <span className="prose font-500">{"Share on"}</span>
        <TwitterSvg width={18} height={18} />
      </Link>
    </Button>
  );
};
