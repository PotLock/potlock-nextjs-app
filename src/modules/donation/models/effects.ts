import { walletApi } from "@/common/api/near";
import {
  CampaignDonation,
  DirectCampaignDonationArgs,
  DirectDonation,
  DirectDonationArgs,
  PotDonation,
  PotDonationArgs,
  campaign,
  donate,
  pot,
} from "@/common/contracts/potlock";
import { floatToYoctoNear } from "@/common/lib";
import { getTransactionStatus } from "@/common/services";
import { AppDispatcher } from "@/store";

import { DonationInputs } from "./schemas";
import {
  DonationAllocationKey,
  DonationAllocationStrategyEnum,
  DonationDirectBatchCallDraft,
  DonationPotBatchCallDraft,
} from "../types";
import { donationInputsToBatchDonationDraft } from "../utils/normalization";

export const effects = (dispatch: AppDispatcher) => ({
  submit: async (
    inputs: DonationAllocationKey & DonationInputs,
  ): Promise<void> => {
    const {
      amount,
      listId,
      campaignId,
      allocationStrategy,
      groupAllocationPlan,
      referrerAccountId,
      bypassProtocolFee,
      bypassChefFee,
      message,
      ...params
    } = inputs;

    const isSingleProjectDonation = "accountId" in params;
    const isPotDonation = "potId" in params;
    const isListDonation = listId !== undefined;
    const isCampaignDonation = campaignId !== undefined;
    if (isSingleProjectDonation) {
      switch (allocationStrategy) {
        case DonationAllocationStrategyEnum.full: {
          const args: DirectDonationArgs = {
            recipient_id: params.accountId,
            message,
            referrer_id: referrerAccountId,
            bypass_protocol_fee: bypassProtocolFee,
          };

          return void donate
            .donate(args, floatToYoctoNear(amount))
            .then((result) => dispatch.donation.success(result))
            .catch((error) => dispatch.donation.failure(error));
        }

        case DonationAllocationStrategyEnum.split: {
          if (!params.potAccountId) {
            return void dispatch.donation.failure(new Error("No pot selected"));
          }

          const args: PotDonationArgs = {
            project_id: params.accountId,
            message,
            referrer_id: referrerAccountId,
            bypass_protocol_fee: bypassProtocolFee,
            custom_chef_fee_basis_points: bypassChefFee ? 0 : undefined,
          };

          return void pot
            .donate(params.potAccountId, args, floatToYoctoNear(amount))
            .then(dispatch.donation.success)
            .catch((error) => dispatch.donation.failure(error));
        }
      }
    } else if (isCampaignDonation) {
      const args: DirectCampaignDonationArgs = {
        campaign_id: campaignId,
        message,
        referrer_id: referrerAccountId,
        bypass_protocol_fee: bypassProtocolFee,
      };
      return void campaign
        .donate(args, floatToYoctoNear(amount))
        .then((result) => dispatch.donation.success(result as CampaignDonation))
        .catch((error) => dispatch.donation.failure(error));
    } else if (isPotDonation && groupAllocationPlan !== undefined) {
      const batchTxDraft = donationInputsToBatchDonationDraft(
        inputs,
      ) as DonationPotBatchCallDraft;

      return void pot
        .donateBatch(batchTxDraft.potAccountId, batchTxDraft.entries)
        // TODO: Handle batch tx outcome
        .then(/* dispatch.donation.success */ console.log)
        .catch(dispatch.donation.failure);
    } else if (isListDonation && groupAllocationPlan !== undefined) {
      const batchTxDraft = donationInputsToBatchDonationDraft(
        inputs,
      ) as DonationDirectBatchCallDraft;

      return void donate.donateBatch(batchTxDraft.entries);
    } else {
      return void dispatch.donation.failure(
        new Error("Unable to determine donation type."),
      );
    }
  },

  handleOutcome: async (transactionHash: string): Promise<void> => {
    // TODO: Use nearRps.txStatus for each tx hash & handle batch tx outcome

    const { accountId: sender_account_id } = walletApi;

    if (sender_account_id) {
      const { data } = await getTransactionStatus({
        tx_hash: transactionHash,
        sender_account_id,
      });

      const donationData = JSON.parse(
        atob(data?.result?.receipts_outcome[3].outcome.status.SuccessValue),
      ) as DirectDonation | PotDonation;

      dispatch.donation.success(donationData);
    } else {
      dispatch.donation.failure(
        new Error(
          "Unable to get donation transaction status without user authentication." +
            "Please login and try again.",
        ),
      );
    }
  },
});
