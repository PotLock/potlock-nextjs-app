import axios from "axios";

import { syncApi } from "@/common/api/indexer";
import { RPC_NODE_URL, walletApi } from "@/common/blockchains/near-protocol/client";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { type CampaignDonation, campaignsContractClient } from "@/common/contracts/core/campaigns";
import { type DirectDonation, donationContractClient } from "@/common/contracts/core/donation";
import { PotDonation, potContractClient } from "@/common/contracts/core/pot";
import { floatToYoctoNear } from "@/common/lib";
import { AccountId, TxExecutionStatus } from "@/common/types";
import { type AppDispatcher } from "@/store";

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
      campaignRecipientAccountId,
      campaignCreatorAccountId,
      potAccountId: singleRecipientMatchingPotId,
      allocationStrategy,
      groupAllocationPlan,
      referrerAccountId,
      bypassProtocolFee,
      bypassCuratorFee,
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
              .then(async (result) => {
                // Sync direct donation to indexer for popup wallets
                if (result.txHash && result.donation) {
                  await syncApi
                    .directDonation(result.txHash, result.donation.donor_id)
                    .catch(() => {});
                }

                dispatch.donation.success(result.donation);
              })
              .catch((error) => {
                onError(error);
                dispatch.donation.failure(error);
              });
          }
        }

        case DonationAllocationStrategyEnum.share: {
          if (singleRecipientMatchingPotId === undefined) {
            return void dispatch.donation.failure(new Error("No pot selected."));
          }

          return void potContractClient
            .donate(
              singleRecipientMatchingPotId,

              {
                project_id: params.accountId,
                message,
                referrer_id: referrerAccountId,
                bypass_protocol_fee: bypassProtocolFee,
                custom_chef_fee_basis_points: bypassCuratorFee ? 0 : undefined,
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
    } else if (isCampaignDonation) {
      if (isFtDonation) {
        if (campaignRecipientAccountId === undefined) {
          return void dispatch.donation.failure(
            new Error("Campaign recipient account id is not provided."),
          );
        }

        if (campaignCreatorAccountId === undefined) {
          return void dispatch.donation.failure(
            new Error("Campaign creator account id is not provided."),
          );
        }

        return void campaignFtDonationMulticall({
          amount,
          campaignId,
          recipientAccountId: campaignRecipientAccountId,
          creatorAccountId: campaignCreatorAccountId,
          referrerAccountId,
          bypassProtocolFee,
          bypassCreatorFee: bypassCuratorFee,
          message,
          tokenId,
        })
          .then(async (result) => {
            if (result.txHash && result.donation) {
              await syncApi
                .campaignDonation(campaignId, result.txHash, result.donation.donor_id)
                .catch(() => {});
            }

            dispatch.donation.success(result.donation);
          })
          .catch((error) => {
            onError(error);
            dispatch.donation.failure(error);
          });
      } else {
        return void campaignsContractClient
          .donate(
            {
              campaign_id: campaignId,
              message,
              referrer_id: referrerAccountId,
              bypass_protocol_fee: bypassProtocolFee,
              bypass_creator_fee: bypassCuratorFee,
            },

            floatToYoctoNear(amount),
          )
          .then(async (result) => {
            if (result.txHash && result.donation) {
              await syncApi
                .campaignDonation(campaignId, result.txHash, result.donation.donor_id)
                .catch(() => {});
            }

            dispatch.donation.success(result.donation);
          })
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
    const { accountId: sender_account_id } = walletApi;

    if (sender_account_id) {
      const { data } = await getTransactionStatus({ tx_hash: transactionHash, sender_account_id });
      const receiptsOutcome = data?.result?.receipts_outcome || [];

      // Parse all direct donations from receipts (handles both single and batch donations)
      const donations: DirectDonation[] = [];

      for (const receipt of receiptsOutcome) {
        const successValue = receipt?.outcome?.status?.SuccessValue;

        if (successValue) {
          try {
            const parsed = JSON.parse(atob(successValue));

            // Check if it's a direct donation (has recipient_id, no campaign_id)
            if (parsed && "recipient_id" in parsed && !("campaign_id" in parsed)) {
              donations.push(parsed as DirectDonation);
            }
          } catch {
            // Not valid JSON, skip
          }
        }
      }

      // Sync all direct donations to indexer
      if (donations.length > 0) {
        await syncApi.directDonation(transactionHash, sender_account_id).catch(() => {});
      }

      // Return first donation for single donations, or array for batch
      const donationData =
        donations.length === 1
          ? donations[0]
          : donations.length > 0
            ? donations
            : JSON.parse(atob(receiptsOutcome[3]?.outcome?.status?.SuccessValue || "null"));

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
