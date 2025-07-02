import { feeBasisPointsToPercents } from "@/common/contracts/core/utils";

import { CAMPAIGN_MAX_FEE_POINTS } from "./constants";

export const isCampaignFeeValid = (percents: number) =>
  percents <= feeBasisPointsToPercents(CAMPAIGN_MAX_FEE_POINTS);
