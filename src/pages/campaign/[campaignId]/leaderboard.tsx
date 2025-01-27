import { ReactElement } from "react";

import { useRouter } from "next/router";

import { CampaignDonorsTable } from "@/entities/campaign";
import { CampaignLayout } from "@/layout/campaign/components/layout";

export default function CampaignLeaderboardPage() {
  const router = useRouter();
  const { campaignId } = router.query as { campaignId: string };

  return <CampaignDonorsTable campaignId={parseInt(campaignId)} />;
}

CampaignLeaderboardPage.getLayout = function getLayout(page: ReactElement) {
  return <CampaignLayout>{page}</CampaignLayout>;
};
