import useSWR from "swr";

import { CONTRACT_SWR_CONFIG, IS_CLIENT } from "@/common/constants";
import type { ByAccountId, ByCampaignId, ConditionalActivation } from "@/common/types";

import * as contractClient from "./client";

export const useCampaigns = ({ enabled = true }: ConditionalActivation | undefined = {}) =>
  useSWR(
    () => (enabled ? ["get_campaigns"] : null),
    () => (!IS_CLIENT ? undefined : contractClient.get_campaigns()),
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
    () => (enabled ? ["useOwnedCampaigns", accountId, params] : null),

    ([_queryKeyHead, accountIdKey, paramsKey]) =>
      !IS_CLIENT
        ? undefined
        : contractClient.get_campaigns_by_owner({ owner_id: accountIdKey, ...paramsKey }),

    CONTRACT_SWR_CONFIG,
  );

export const useCampaign = ({ enabled = true, campaignId }: ByCampaignId & ConditionalActivation) =>
  useSWR(
    () => (enabled ? ["useCampaign", campaignId] : null),

    ([_queryKeyHead, campaignIdKey]) =>
      !IS_CLIENT ? undefined : contractClient.get_campaign({ campaign_id: campaignIdKey }),

    CONTRACT_SWR_CONFIG,
  );

export const useCampaignDonations = ({
  enabled = true,
  campaignId,
  ...params
}: ByCampaignId & Omit<contractClient.GetCampaignArgs, "campaign_id"> & ConditionalActivation) =>
  useSWR(
    () => (enabled ? ["useCampaignDonations", campaignId, params] : null),

    ([_queryKeyHead, campaignIdKey, paramsKey]) =>
      !IS_CLIENT
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
    () => (enabled ? ["useHasEscrowedDonationsToProcess", campaignId, params] : null),

    ([_queryKeyHead, campaignIdKey, paramsKey]) =>
      !IS_CLIENT
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
    () => (enabled ? ["isDonationsRefundsProcessed", campaignId, params] : null),

    ([_queryKeyHead, campaignIdKey, paramsKey]) =>
      !IS_CLIENT
        ? undefined
        : contractClient.can_process_refunds({ campaign_id: campaignIdKey, ...paramsKey }),

    CONTRACT_SWR_CONFIG,
  );

export const useConfig = ({ enabled = true }: ConditionalActivation | undefined = {}) =>
  useSWR(
    () => (enabled ? ["campaigns_config"] : null),
    ([_queryKeyHead]) => (!IS_CLIENT ? undefined : contractClient.get_config()),
  );
