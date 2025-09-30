import { useMemo } from "react";

import Link from "next/link";

import {
  APP_DEFAULT_PUBLIC_URL,
  PLATFORM_TWITTER_ACCOUNT_ID,
  X_INTENT_URL_BASE,
} from "@/common/constants";
import type { Campaign } from "@/common/contracts/core/campaigns";
import type { AccountId, CampaignId } from "@/common/types";
import { Button, Skeleton } from "@/common/ui/layout/components";
import TwitterSvg from "@/common/ui/layout/svg/twitter";
import { useWalletUserSession } from "@/common/wallet";
import { useAccountSocialProfile } from "@/entities/_shared/account";
import { routeSelectors } from "@/navigation";

export type DonationCampaignSuccessXShareButtonProps = {
  campaignId: CampaignId;
  campaignName: Campaign["name"];
  recipientAccountId: AccountId;
};

export const DonationCampaignSuccessXShareButton: React.FC<
  DonationCampaignSuccessXShareButtonProps
> = ({ campaignId, campaignName, recipientAccountId }) => {
  const viewer = useWalletUserSession();

  const { isLoading: isRecipientSocialProfileLoading, profile: recipientSocialProfile } =
    useAccountSocialProfile({ accountId: recipientAccountId });

  const intent = useMemo(() => {
    const recipientReference = recipientSocialProfile?.linktree?.twitter
      ? `${recipientSocialProfile?.name ?? recipientAccountId} (@${
          recipientSocialProfile.linktree.twitter
        })`
      : `${
          recipientSocialProfile?.name !== undefined && recipientSocialProfile?.name?.length > 1
            ? `${recipientSocialProfile.name} (${recipientAccountId})`
            : recipientAccountId
        }`;

    const text = encodeURIComponent(
      `🎉 Just supported ${campaignName} and ${recipientReference} through @${
        PLATFORM_TWITTER_ACCOUNT_ID
      }!\n\n` + "Support the campaign here:",
    );

    const baseUrl = `${APP_DEFAULT_PUBLIC_URL}${routeSelectors.CAMPAIGN_BY_ID(campaignId)}`;

    const fullUrl = viewer.isSignedIn
      ? `${baseUrl}?referrerAccountId=${viewer.accountId}`
      : baseUrl;

    const encodedUrl = encodeURIComponent(fullUrl);
    const encodedRelation = encodeURIComponent(APP_DEFAULT_PUBLIC_URL);

    return X_INTENT_URL_BASE + text + `&url=${encodedUrl}` + `&related=${encodedRelation}`;
  }, [
    campaignId,
    campaignName,
    recipientAccountId,
    recipientSocialProfile?.linktree?.twitter,
    recipientSocialProfile?.name,
    viewer.accountId,
    viewer.isSignedIn,
  ]);

  return isRecipientSocialProfileLoading ? (
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
