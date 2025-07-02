import { ReactElement } from "react";

import { useRouter } from "next/router";

import { CampaignSettings, useCampaignCreateOrUpdateRedirect } from "@/entities/campaign";
import { CampaignLayout } from "@/layout/campaign/components/layout";

const Settings = () => {
  const router = useRouter();
  const { campaignId } = router.query as { campaignId: string };

  useCampaignCreateOrUpdateRedirect();

  return <CampaignSettings campaignId={parseInt(campaignId)} />;
};

Settings.getLayout = function getLayout(page: ReactElement) {
  return <CampaignLayout>{page}</CampaignLayout>;
};

export default Settings;
