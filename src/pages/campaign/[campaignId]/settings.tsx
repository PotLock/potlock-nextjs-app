import { ReactElement } from "react";

import { CampaignSettings } from "@/entities/campaign";
import { CampaignLayout } from "@/layout/campaign/components/layout";

const Settings = () => {
  return <CampaignSettings />;
};

Settings.getLayout = function getLayout(page: ReactElement) {
  return <CampaignLayout>{page}</CampaignLayout>;
};

export default Settings;
