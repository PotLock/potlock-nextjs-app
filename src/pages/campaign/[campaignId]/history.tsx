import { ReactElement } from "react";

import { CampaignLayout } from "@/layout/campaign/components/layout";

const CampaignHistory = () => {
  return <div className="">WIP</div>;
};

CampaignHistory.getLayout = function getLayout(page: ReactElement) {
  return <CampaignLayout>{page}</CampaignLayout>;
};

export default CampaignHistory;
