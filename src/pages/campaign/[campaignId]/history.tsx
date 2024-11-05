import { ReactElement } from "react";

import { CampaignLayout } from "@/modules/campaigns/components";

const CampaignHistory = () => {
  return <div className="">Hello</div>;
};

CampaignHistory.getLayout = function getLayout(page: ReactElement) {
  return <CampaignLayout>{page}</CampaignLayout>;
};

export default CampaignHistory;
