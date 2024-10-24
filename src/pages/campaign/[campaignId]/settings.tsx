import { ReactElement } from "react";

import {
  CampaignLayout,
  CampaignSettings,
} from "@/modules/campaigns/components";

const Settings = () => {
  return <CampaignSettings />;
};

Settings.getLayout = function getLayout(page: ReactElement) {
  return <CampaignLayout>{page}</CampaignLayout>;
};

export default Settings;
