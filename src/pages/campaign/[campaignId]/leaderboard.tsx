import { ReactElement } from "react";

import {
  CampaignDonorsTable,
  CampaignLayout,
} from "@/modules/campaigns/components";

const CampaignLeaderBoard = () => {
  return <CampaignDonorsTable />;
};

CampaignLeaderBoard.getLayout = function getLayout(page: ReactElement) {
  return <CampaignLayout>{page}</CampaignLayout>;
};

export default CampaignLeaderBoard;
