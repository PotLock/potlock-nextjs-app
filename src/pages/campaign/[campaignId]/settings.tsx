import { CampaignLayout, CampaignSettings } from "@/modules/campaigns/components";
import { ReactElement } from "react";


const Settings = () => {
  return   <CampaignSettings />
 
};

Settings.getLayout = function getLayout(page: ReactElement) {
  return <CampaignLayout>{page}</CampaignLayout>;
};

export default Settings;
