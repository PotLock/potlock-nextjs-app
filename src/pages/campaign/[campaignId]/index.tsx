import { ReactElement, useMemo } from "react";

import { useRouter } from "next/router";

import { APP_METADATA } from "@/common/constants";
import { CampaignDonorsTable, CampaignSettings } from "@/entities/campaign";
import { CampaignLayout } from "@/layout/campaign/components/layout";
import { RootLayout } from "@/layout/components/root-layout";

type SeoProps = {
  seoTitle: string;
  seoDescription: string;
  seoImage?: string;
};

export default function CampaignPage() {
  const router = useRouter();
  const { campaignId, tab } = router.query as { campaignId: string; tab?: string };

  const parsedCampaignId = Number.isNaN(parseInt(campaignId)) ? undefined : parseInt(campaignId);

  const seo: SeoProps = useMemo(
    () => ({
      seoTitle: campaignId ? `Campaign ${campaignId} | Potlock` : `Campaign | Potlock`,
      seoDescription: APP_METADATA.description,
      seoImage: APP_METADATA.openGraph.images.url,
    }),
    [campaignId],
  );

  // Determine which content to show based on tab param
  const content = useMemo(() => {
    switch (tab) {
      case "settings":
        return <CampaignSettings campaignId={parsedCampaignId ?? 0} />;
      case "leaderboard":
      default:
        return <CampaignDonorsTable campaignId={parsedCampaignId ?? 0} />;
    }
  }, [tab, parsedCampaignId]);

  return (
    <RootLayout title={seo.seoTitle} description={seo.seoDescription} image={seo.seoImage}>
      {content}
    </RootLayout>
  );
}

CampaignPage.getLayout = function getLayout(page: ReactElement) {
  return <CampaignLayout>{page}</CampaignLayout>;
};
