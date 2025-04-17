import axios from "axios";

import { RPC_NODE_URL, walletApi } from "@/common/blockchains/near-protocol/client";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import {
  type DirectCampaignDonationArgs,
  campaignsContractClient,
} from "@/common/contracts/core/campaigns";
import {
  type DirectDonation,
  type DirectDonationArgs,
  donationContractClient,
} from "@/common/contracts/core/donation";
import { PotDonation, PotDonationArgs, potContractClient } from "@/common/contracts/core/pot";
import { floatToYoctoNear } from "@/common/lib";
import { AccountId, TxExecutionStatus } from "@/common/types";
import { AppDispatcher } from "@/store";

import { donationFtMulticall } from "./ft";
import {
  DonationAllocationKey,
  DonationAllocationStrategyEnum,
  DonationDirectBatchCallDraft,
  DonationPotBatchCallDraft,
} from "../../types";
import { donationInputsToBatchDonationDraft } from "../../utils/normalization";
import { type DonationSubmitParams } from "../schemas";

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
      allocationStrategy,
      groupAllocationPlan,
      referrerAccountId,
      bypassProtocolFee,
      bypassChefFee,
      message,
      tokenId,
      ...params
    } = inputs;

    const isSingleProjectDonation = "accountId" in params;
    const isFtDonation = tokenId !== NATIVE_TOKEN_ID;
    const isPotDonation = "potId" in params;
    const isListDonation = listId !== undefined;
    const isCampaignDonation = campaignId !== undefined;

    if (isSingleProjectDonation) {
      switch (allocationStrategy) {
        case DonationAllocationStrategyEnum.full: {
          if (isFtDonation) {
            return void donationFtMulticall({
              amount,
              recipientAccountId: params.accountId,
              referrerAccountId,
              bypassProtocolFee,
              message,
              tokenId,
            })
              .then((result) => {
                console.log(result);

                // TODO: resolve this
                // @ts-expect-error WIP
                dispatch.donation.success(result);
              })
              .catch((error) => {
                onError(error);
                dispatch.donation.failure(error);
              });
          } else {
            const args: DirectDonationArgs = {
              recipient_id: params.accountId,
              message,
              referrer_id: referrerAccountId,
              bypass_protocol_fee: bypassProtocolFee,
            };

            return void donationContractClient
              .donate(args, floatToYoctoNear(amount))
              .then((result) => dispatch.donation.success(result))
              .catch((error) => dispatch.donation.failure(error));
          }
        }

        case DonationAllocationStrategyEnum.share: {
          if (!params.potAccountId) {
            return void dispatch.donation.failure(new Error("No pot selected."));
          }

          const args: PotDonationArgs = {
            project_id: params.accountId,
            message,
            referrer_id: referrerAccountId,
            bypass_protocol_fee: bypassProtocolFee,
            custom_chef_fee_basis_points: bypassChefFee ? 0 : undefined,
          };

          return void potContractClient
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

      return void campaignsContractClient
        .donate(args, floatToYoctoNear(amount))
        .then((result) => dispatch.donation.success(result))
        .catch((error) => dispatch.donation.failure(error));
    } else if (isPotDonation && groupAllocationPlan !== undefined) {
      const batchTxDraft = donationInputsToBatchDonationDraft(inputs) as DonationPotBatchCallDraft;

      return void potContractClient
        .donateBatch(batchTxDraft.potAccountId, batchTxDraft.entries)
        // TODO: Handle batch tx outcome
        .then(/* dispatch.donation.success */ console.log)
        .catch(dispatch.donation.failure);
    } else if (isListDonation && groupAllocationPlan !== undefined) {
      const batchTxDraft = donationInputsToBatchDonationDraft(
        inputs,
      ) as DonationDirectBatchCallDraft;

      // TODO: Handle batch tx outcome
      return void donationContractClient.donateBatch(batchTxDraft.entries);
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
