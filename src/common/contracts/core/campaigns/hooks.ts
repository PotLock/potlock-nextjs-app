import useSWR from "swr";

import { IS_CLIENT } from "@/common/constants";
import type { ByCampaignId, ConditionalActivation } from "@/common/types";

import * as contractClient from "./client";

export const useCampaign = ({ enabled = true, campaignId }: ByCampaignId & ConditionalActivation) =>
  useSWR(["useCampaign", campaignId], ([_queryKey, campaignIdKey]) =>
    !enabled || !IS_CLIENT
      ? undefined
      : contractClient.get_campaign({ campaign_id: campaignIdKey }),
  );
