import useSWR from "swr";

import { CONTRACT_SWR_CONFIG, IS_CLIENT } from "@/common/constants";
import type { ByAccountId, ByCampaignId, ConditionalActivation } from "@/common/types";

import * as contractClient from "./client";

export const useCampaigns = ({ enabled = true }: ConditionalActivation | undefined = {}) =>
  useSWR(
    ["get_campaigns"],
    () => (!enabled || !IS_CLIENT ? undefined : contractClient.get_campaigns()),
    CONTRACT_SWR_CONFIG,
  );

export const useOwnedCampaigns = ({
  enabled = true,
  accountId,
  ...params
}: ByAccountId &
  Omit<contractClient.GetCampaignsByOwnerArgs, "owner_id"> &
  ConditionalActivation) =>
  useSWR(
    ["useOwnedCampaigns", accountId, params],

    ([_queryKeyHead, accountIdKey, paramsKey]) =>
      !enabled || !IS_CLIENT
        ? undefined
        : contractClient.get_campaigns_by_owner({ owner_id: accountIdKey, ...paramsKey }),

    CONTRACT_SWR_CONFIG,
  );

export const useCampaign = ({ enabled = true, campaignId }: ByCampaignId & ConditionalActivation) =>
  useSWR(
    ["useCampaign", campaignId],

    ([_queryKeyHead, campaignIdKey]) =>
      !enabled || !IS_CLIENT
        ? undefined
        : contractClient.get_campaign({ campaign_id: campaignIdKey }),

    CONTRACT_SWR_CONFIG,
  );

export const useCampaignDonations = ({
  enabled = true,
  campaignId,
  ...params
}: ByCampaignId & Omit<contractClient.GetCampaignArgs, "campaign_id"> & ConditionalActivation) =>
  useSWR(
    ["useCampaignDonations", campaignId, params],

    ([_queryKeyHead, campaignIdKey, paramsKey]) =>
      !enabled || !IS_CLIENT
        ? undefined
        : contractClient.get_donations_for_campaign({ campaign_id: campaignIdKey, ...paramsKey }),

    CONTRACT_SWR_CONFIG,
  );

export const useHasEscrowedDonationsToProcess = ({
  enabled = true,
  campaignId,
  ...params
}: ByCampaignId & ConditionalActivation) =>
  useSWR(
    ["useHasEscrowedDonationsToProcess", campaignId, params],

    ([_queryKeyHead, campaignIdKey, paramsKey]) =>
      !enabled || !IS_CLIENT
        ? undefined
        : contractClient.has_escrowed_donations_to_process({
            campaign_id: campaignIdKey,
            ...paramsKey,
          }),

    CONTRACT_SWR_CONFIG,
  );

export const useIsDonationRefundsProcessed = ({
  enabled = true,
  campaignId,
  ...params
}: ByCampaignId & ConditionalActivation) =>
  useSWR(
    ["isDonationsRefundsProcessed", campaignId, params],

    ([_queryKeyHead, campaignIdKey, paramsKey]) =>
      !enabled || !IS_CLIENT
        ? undefined
        : contractClient.can_process_refunds({
            campaign_id: campaignIdKey,
            ...paramsKey,
          }),

    CONTRACT_SWR_CONFIG,
  );

export const useConfig = ({ enabled = true }: ConditionalActivation | undefined = {}) =>
  useSWR(["campaigns_config"], ([_queryKeyHead]) =>
    !enabled || !IS_CLIENT ? undefined : contractClient.get_config(),
  );
