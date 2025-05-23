import axios from "axios";

import { RPC_NODE_URL, walletApi } from "@/common/blockchains/near-protocol/client";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { type CampaignDonation, campaignsContractClient } from "@/common/contracts/core/campaigns";
import { type DirectDonation, donationContractClient } from "@/common/contracts/core/donation";
import { PotDonation, potContractClient } from "@/common/contracts/core/pot";
import { floatToYoctoNear } from "@/common/lib";
import { AccountId, TxExecutionStatus } from "@/common/types";
import { AppDispatcher } from "@/store";

import { campaignFtDonationMulticall } from "./campaign-ft-donation";
import { directFtDonationMulticall } from "./direct-ft-donation";
import { groupListDonationMulticall } from "./group-list-donation";
import { DonationAllocationKey, DonationAllocationStrategyEnum } from "../../types";
import { type DonationSubmitParams } from "../schemas";
import { groupPotDonationMulticall } from "./group-pot-donation";

/**
 * @deprecated use `nearRpc.txStatus()`
 */
const getTransactionStatus = ({
  wait_until = "EXECUTED_OPTIMISTIC",
  ...params
}: {
  tx_hash: string;
  sender_account_id: AccountId;
  wait_until?: TxExecutionStatus;
}) =>
  axios.post(RPC_NODE_URL, {
    jsonrpc: "2.0",
    id: "dontcare",
    method: "tx",
    params: { wait_until, ...params },
  });

export type DonationSubmitCallbacks = {
  onError: (error: Error) => void;
};

export const effects = (dispatch: AppDispatcher) => ({
  submit: async ({
    onError,
    ...inputs
  }: DonationAllocationKey & DonationSubmitParams & DonationSubmitCallbacks): Promise<void> => {
    const {
      amount,
      listId,
      campaignId,
      potAccountId: singleRecipientMatchingPotId,
      allocationStrategy,
      groupAllocationPlan,
      referrerAccountId,
      bypassProtocolFee,
      bypassChefFee,
      message,
      tokenId,
      ...params
    } = inputs;

    const isSingleRecipientDonation = "accountId" in params;
    const isFtDonation = tokenId !== NATIVE_TOKEN_ID;
    const isGroupPotDonation = "potId" in params;
    const isListDonation = listId !== undefined;
    const isCampaignDonation = campaignId !== undefined;

    if (isSingleRecipientDonation) {
      switch (allocationStrategy) {
        case DonationAllocationStrategyEnum.full: {
          if (isFtDonation) {
            return void directFtDonationMulticall({
              recipientAccountId: params.accountId,
              message,
              referrerAccountId,
              bypassProtocolFee,
              tokenId,
              amount,
            })
              .then(dispatch.donation.success)
              .catch((error) => {
                onError(error);
                dispatch.donation.failure(error);
              });
          } else {
            return void donationContractClient
              .donate(
                {
                  recipient_id: params.accountId,
                  message,
                  referrer_id: referrerAccountId,
                  bypass_protocol_fee: bypassProtocolFee,
                },

                floatToYoctoNear(amount),
              )
              .then(dispatch.donation.success)
              .catch((error) => {
                onError(error);
                dispatch.donation.failure(error);
              });
          }
        }

        case DonationAllocationStrategyEnum.share: {
          if (singleRecipientMatchingPotId === undefined) {
            return void dispatch.donation.failure(new Error("No pot selected."));
          } else {
            return void potContractClient
              .donate(
                singleRecipientMatchingPotId,

                {
                  project_id: params.accountId,
                  message,
                  referrer_id: referrerAccountId,
                  bypass_protocol_fee: bypassProtocolFee,
                  custom_chef_fee_basis_points: bypassChefFee ? 0 : undefined,
                },

                floatToYoctoNear(amount),
              )
              .then(dispatch.donation.success)
              .catch((error) => {
                onError(error);
                dispatch.donation.failure(error);
              });
          }
        }
      }
    } else if (isCampaignDonation) {
      if (isFtDonation) {
        return void campaignFtDonationMulticall({
          amount,
          campaignId,
          referrerAccountId,
          bypassProtocolFee,
          // TODO: Functionality is not implemented, but might be required
          bypassCreatorFee: false,
          message,
          tokenId,
        });
      } else {
        return void campaignsContractClient
          .donate(
            {
              campaign_id: campaignId,
              message,
              referrer_id: referrerAccountId,
              bypass_protocol_fee: bypassProtocolFee,
              // TODO: Functionality is not implemented, but might be required
              bypass_creator_fee: false,
            },

            floatToYoctoNear(amount),
          )
          .then(dispatch.donation.success)
          .catch((error) => {
            onError(error);
            dispatch.donation.failure(error);
          });
      }
    } else if (isGroupPotDonation && groupAllocationPlan !== undefined) {
      return void groupPotDonationMulticall({ ...inputs, potContractAccountId: params.potId })
        .then(dispatch.donation.success)
        .catch((error) => {
          onError(error);
          dispatch.donation.failure(error);
        });
    } else if (isListDonation && groupAllocationPlan !== undefined) {
      return void groupListDonationMulticall(inputs)
        .then(dispatch.donation.success)
        .catch((error) => {
          onError(error);
          dispatch.donation.failure(error);
        });
    } else {
      return void dispatch.donation.failure(new Error("Unable to determine donation type."));
    }
  },

  handleOutcome: async (transactionHash: string): Promise<void> => {
    // TODO: Use nearRps.txStatus for each tx hash & handle batch tx outcome

    const { accountId: sender_account_id } = walletApi;

    if (sender_account_id) {
      const { data } = await getTransactionStatus({ tx_hash: transactionHash, sender_account_id });

      const donationData = JSON.parse(
        atob(data?.result?.receipts_outcome[3].outcome.status.SuccessValue),
      ) as DirectDonation | CampaignDonation | PotDonation;

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
