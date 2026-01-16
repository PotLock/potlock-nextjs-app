import { ReactElement, useMemo } from "react";

import { useRouter } from "next/router";

import { APP_METADATA } from "@/common/constants";
import { CampaignDonorsTable, CampaignSettings } from "@/entities/campaign";
import { CampaignLayout } from "@/layout/campaign/components/layout";
import { RootLayout } from "@/layout/components/root-layout";

export default function CampaignPage() {
  const router = useRouter();
  const { tab, campaignId } = router.query as { tab?: string; campaignId?: string };

  const parsedCampaignId = campaignId ? parseInt(campaignId) : undefined;

  // Determine which content to show based on tab param
  const content = useMemo(() => {
    if (!parsedCampaignId || Number.isNaN(parsedCampaignId)) {
      return null;
    }

    switch (tab) {
      case "settings":
        return <CampaignSettings campaignId={parsedCampaignId} />;
      case "leaderboard":
      default:
        return <CampaignDonorsTable campaignId={parsedCampaignId} />;
    }
  }, [tab, parsedCampaignId]);

  return (
    <RootLayout
      title={`Campaign ${parsedCampaignId}`}
      description={APP_METADATA.description}
      image={APP_METADATA.openGraph.images.url}
    >
      {content}
    </RootLayout>
  );
}

CampaignPage.getLayout = function getLayout(page: ReactElement) {
  return <CampaignLayout>{page}</CampaignLayout>;
};
