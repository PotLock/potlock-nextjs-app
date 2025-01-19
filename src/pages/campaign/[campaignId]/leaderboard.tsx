import { ReactElement } from "react";

import { CampaignDonorsTable } from "@/entities/campaign";
import { CampaignLayout } from "@/layout/campaign/components/layout";

const CampaignLeaderBoard = () => {
  return <CampaignDonorsTable />;
};

CampaignLeaderBoard.getLayout = function getLayout(page: ReactElement) {
  return <CampaignLayout>{page}</CampaignLayout>;
};

export default CampaignLeaderBoard;
