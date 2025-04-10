import { donationFeeBasisPointsToPercents } from "@/features/donation";

import { CAMPAIGN_MAX_FEE_POINTS } from "./constants";

export const isCampaignFeeValid = (percents: number) =>
  percents <= donationFeeBasisPointsToPercents(CAMPAIGN_MAX_FEE_POINTS);
