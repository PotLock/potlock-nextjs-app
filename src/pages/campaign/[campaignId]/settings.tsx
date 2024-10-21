import { ReactElement } from "react";

import { CampaignLayout } from "@/modules/campaigns/components/CampaignLayout";

const CampaignSettings = () => {
  return <div className="">Hello</div>;
};

CampaignSettings.getLayout = function getLayout(page: ReactElement) {
  return <CampaignLayout>{page}</CampaignLayout>;
};

export default CampaignSettings;
