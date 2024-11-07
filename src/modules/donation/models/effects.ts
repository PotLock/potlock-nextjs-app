import axios from "axios";

import { RPC_NODE_URL, walletApi } from "@/common/api/near";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import {
  CampaignDonation,
  DirectCampaignDonationArgs,
  DirectDonation,
  DirectDonationArgs,
  PotDonation,
  PotDonationArgs,
  campaign,
  donationClient,
  pot,
} from "@/common/contracts/potlock";
import { floatToYoctoNear } from "@/common/lib";
import { AccountId, TxExecutionStatus } from "@/common/types";
import { AppDispatcher } from "@/store";

import { DonationInputs } from "./schemas";
import { DONATION_BASE_STORAGE_DEPOSIT_FLOAT } from "../constants";
import {
  DonationAllocationKey,
  DonationAllocationStrategyEnum,
  DonationDirectBatchCallDraft,
  DonationPotBatchCallDraft,
} from "../types";
import { donationInputsToBatchDonationDraft } from "../utils/normalization";

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
      tokenId,
      ...params
    } = inputs;

    const isSingleProjectDonation = "accountId" in params;
    const isPotDonation = "potId" in params;
    const isListDonation = listId !== undefined;
    const isCampaignDonation = campaignId !== undefined;

    const requiredDepositFloat =
      /* Additional 0.0001 NEAR per message character */
      DONATION_BASE_STORAGE_DEPOSIT_FLOAT + 0.0001 * (message?.length ?? 0);

    // const storageBalanceBounds = Near.view<any>(
    //   selectedDenomination.id,
    //   "storage_balance_bounds",
    //   {},
    // );

    // const storageBalanceProtocolFeeRecipient = Near.view<any>(
    //   selectedDenomination.id,
    //   "storage_balance_of",
    //   {
    //     account_id: protocolFeeRecipientAccount,
    //   },
    // );

    // const storageBalanceReferrer = referrerId
    //   ? Near.view<any>(selectedDenomination.id, "storage_balance_of", {
    //       account_id: referrerId,
    //     })
    //   : null;

    // const storageBalanceDonationContract = Near.view<any>(
    //   selectedDenomination.id,
    //   "storage_balance_of",
    //   {
    //     account_id: DONATION_CONTRACT_ACCOUNT_ID,
    //   },
    // );

    if (isSingleProjectDonation) {
      switch (allocationStrategy) {
        case DonationAllocationStrategyEnum.full: {
          if (tokenId !== NATIVE_TOKEN_ID) {
            console.log("FT direct donation mode ON");

            // const transactions = [];

            // // adding storage deposit
            // transactions.push({
            //   contractName: DONATION_CONTRACT_ACCOUNT_ID,
            //   methodName: "storage_deposit",
            //   args: {},
            //   deposit: Big(requiredDepositFloat).mul(Big(10).pow(24)),
            //   gas: "100000000000000",
            // });

            // const { min, max } = storageBalanceBounds;
            // const storageMaxBig = Big(max);

            // // check storage balance for each account
            // if (
            //   !bypassProtocolFee &&
            //   (!storageBalanceProtocolFeeRecipient ||
            //     Big(storageBalanceProtocolFeeRecipient.total).lt(storageMaxBig))
            // ) {
            //   transactions.push({
            //     contractName: tokenId,
            //     methodName: "storage_deposit",
            //     args: { account_id: protocolFeeRecipientAccount },
            //     deposit: storageMaxBig.minus(
            //       Big(storageBalanceProtocolFeeRecipient || 0),
            //     ),
            //     gas: "100000000000000",
            //   });
            // }

            // // referrer
            // if (
            //   referrerAccountId &&
            //   (!storageBalanceReferrer ||
            //     Big(storageBalanceReferrer.total).lt(storageMaxBig))
            // ) {
            //   transactions.push({
            //     contractName: tokenId,
            //     methodName: "storage_deposit",
            //     args: { account_id: referrerAccountId },
            //     deposit: storageMaxBig.minus(Big(storageBalanceReferrer || 0)),
            //     gas: "100000000000000",
            //   });
            // }

            // // donation contract
            // if (
            //   !storageBalanceDonationContract ||
            //   Big(storageBalanceDonationContract.total).lt(storageMaxBig)
            // ) {
            //   transactions.push({
            //     contractName: tokenId,
            //     methodName: "storage_deposit",
            //     args: { account_id: constants.DONATION_CONTRACT_ID },
            //     deposit: storageMaxBig.minus(
            //       Big(storageBalanceDonationContract || 0),
            //     ),
            //     gas: "100000000000000",
            //   });
            // }

            // // project (can't do this till this point)
            // Near.asyncView(tokenId, "storage_balance_of", {
            //   account_id: params.accountId,
            // }).then((balance) => {
            //   if (!balance || Big(balance.total).lt(storageMaxBig)) {
            //     transactions.push({
            //       contractName: tokenId,
            //       methodName: "storage_deposit",
            //       args: { account_id: params.accountId },
            //       deposit: storageMaxBig.minus(Big(balance || 0)),
            //       gas: "100000000000000",
            //     });
            //   }

            //   // add donation transaction
            //   transactions.push({
            //     contractName: tokenId,
            //     methodName: "ft_transfer_call",
            //     args: {
            //       receiver_id: DONATION_CONTRACT_ACCOUNT_ID,

            //       amount: Big(amount)
            //         .mul(new Big(10).pow(selectedDenomination.decimals))
            //         .toFixed(0),

            //       msg: JSON.stringify({
            //         recipient_id: params.accountId,
            //         referrer_id: referrerAccountId || null,
            //         bypass_protocol_fee: bypassProtocolFee,
            //         message,
            //       }),
            //     },

            //     deposit: "1",
            //     gas: "300000000000000",
            //   });

            //   Near.call(transactions);
            // });

            return void "WIP";
          } else {
            const args: DirectDonationArgs = {
              recipient_id: params.accountId,
              message,
              referrer_id: referrerAccountId,
              bypass_protocol_fee: bypassProtocolFee,
            };

            return void donationClient
              .donate(args, floatToYoctoNear(amount))
              .then((result) => dispatch.donation.success(result))
              .catch((error) => dispatch.donation.failure(error));
          }
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

      return void donationClient.donateBatch(batchTxDraft.entries);
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
