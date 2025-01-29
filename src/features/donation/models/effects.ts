import { ONE_YOCTO } from "@builddao/near-social-js";
import axios from "axios";
import { Big } from "big.js";

import { DONATION_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { RPC_NODE_URL, naxiosInstance, walletApi } from "@/common/api/near-protocol/client";
import { FULL_TGAS, NATIVE_TOKEN_DECIMALS, NATIVE_TOKEN_ID } from "@/common/constants";
import {
  type CampaignDonation,
  type DirectCampaignDonationArgs,
  campaignsContractClient,
} from "@/common/contracts/core/campaigns";
import {
  type DirectDonation,
  type DirectDonationArgs,
  donationContractClient,
} from "@/common/contracts/core/donation";
import { PotDonation, PotDonationArgs, potContractClient } from "@/common/contracts/core/pot";
import type { FungibleTokenMetadata } from "@/common/contracts/tokens/fungible";
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
  submit: async (inputs: DonationAllocationKey & DonationInputs): Promise<void> => {
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

    if (isSingleProjectDonation) {
      switch (allocationStrategy) {
        case DonationAllocationStrategyEnum.full: {
          const { protocol_fee_recipient_account } = await donationContractClient.getConfig();

          if (tokenId !== NATIVE_TOKEN_ID) {
            console.log("FT direct donation mode ON");

            const tokenClient = naxiosInstance.contractApi({
              contractId: tokenId,
            });

            const requiredDepositNear = Big(DONATION_BASE_STORAGE_DEPOSIT_FLOAT).plus(
              /* Additional 0.0001 NEAR per message character */
              Big(0.0001).mul(Big(message?.length ?? 0)),
            );

            const referrerStorageBalance = referrerAccountId
              ? await tokenClient.view<
                  { account_id: AccountId },
                  { total: string; available: string }
                >("storage_balance_of", {
                  args: { account_id: referrerAccountId },
                })
              : null;

            const [
              ftMetadata = null,
              ftStorageBalanceBounds = null,
              protocolFeeRecipientFtStorageBalance = null,
              donationContractFtStorageBalance = null,
              recipientFtStorageBalance = null,
            ] = await Promise.all([
              tokenClient.view<{}, FungibleTokenMetadata>("ft_metadata"),

              tokenClient.view<{}, { min: string; max: string }>("storage_balance_bounds"),

              tokenClient.view<{ account_id: AccountId }, { total: string; available: string }>(
                "storage_balance_of",
                {
                  args: { account_id: protocol_fee_recipient_account },
                },
              ),

              tokenClient.view<{ account_id: AccountId }, { total: string; available: string }>(
                "storage_balance_of",
                {
                  args: { account_id: DONATION_CONTRACT_ACCOUNT_ID },
                },
              ),

              tokenClient.view<{ account_id: AccountId }, { total: string; available: string }>(
                "storage_balance_of",
                {
                  args: { account_id: params.accountId },
                },
              ),
            ]);

            const maxFtStorageBalance =
              ftStorageBalanceBounds === null ? null : Big(ftStorageBalanceBounds.max);

            const transactions = [
              /**
               *? FT storage balance replenishment for protocol fee recipient account
               */
              ...(!bypassProtocolFee &&
              (protocolFeeRecipientFtStorageBalance === null ||
                (maxFtStorageBalance !== null &&
                  Big(protocolFeeRecipientFtStorageBalance.total).lt(maxFtStorageBalance)))
                ? [
                    {
                      method: "storage_deposit",
                      args: { account_id: protocol_fee_recipient_account },

                      deposit: maxFtStorageBalance?.minus(
                        Big(protocolFeeRecipientFtStorageBalance?.total ?? 0),
                      ),

                      gas: "100000000000000",
                    },
                  ]
                : []),

              /**
               *? FT contract storage balance replenishment for referrer account
               */
              ...(referrerAccountId &&
              (referrerStorageBalance === null ||
                (maxFtStorageBalance !== null &&
                  Big(referrerStorageBalance.total).lt(maxFtStorageBalance)))
                ? [
                    {
                      method: "storage_deposit",
                      args: { account_id: referrerAccountId },

                      deposit: maxFtStorageBalance?.minus(Big(referrerStorageBalance?.total || 0)),

                      gas: "100000000000000",
                    },
                  ]
                : []),

              /**
               *? FT contract storage balance replenishment for donation contract account
               */
              ...(donationContractFtStorageBalance === null ||
              (maxFtStorageBalance !== null &&
                Big(donationContractFtStorageBalance.total).lt(maxFtStorageBalance))
                ? [
                    {
                      method: "storage_deposit",
                      args: { account_id: DONATION_CONTRACT_ACCOUNT_ID },

                      deposit: maxFtStorageBalance?.minus(
                        Big(donationContractFtStorageBalance?.total || 0),
                      ),

                      gas: "100000000000000",
                    },
                  ]
                : []),

              /**
               *? FT contract storage balance replenishment for donation recipient account
               */
              ...(recipientFtStorageBalance === null ||
              (maxFtStorageBalance !== null &&
                Big(recipientFtStorageBalance.total).lt(maxFtStorageBalance))
                ? [
                    {
                      method: "storage_deposit",
                      args: { account_id: params.accountId },

                      deposit: maxFtStorageBalance?.minus(
                        Big(recipientFtStorageBalance?.total || 0),
                      ),

                      gas: "100000000000000",
                    },
                  ]
                : []),

              {
                method: "ft_transfer_call",

                args: {
                  receiver_id: DONATION_CONTRACT_ACCOUNT_ID,

                  amount: Big(amount)
                    .mul(new Big(10).pow(ftMetadata?.decimals ?? NATIVE_TOKEN_DECIMALS))
                    .toFixed(0),

                  msg: JSON.stringify({
                    recipient_id: params.accountId,
                    referrer_id: referrerAccountId || null,
                    bypass_protocol_fee: bypassProtocolFee,
                    message,
                  }),
                },

                deposit: ONE_YOCTO,
                gas: FULL_TGAS,
              },
            ];

            console.log(transactions);

            return void donationContractClient
              .storage_deposit(requiredDepositNear.mul(Big(10).pow(24)).toString())
              .then((updatedStorageBalance) =>
                // @ts-expect-error WIP
                tokenClient.callMultiple(transactions),
              )
              .catch((error) => dispatch.donation.failure(error));
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
        .then((result) => dispatch.donation.success(result as CampaignDonation))
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

      return void donationContractClient.donateBatch(batchTxDraft.entries);
    } else {
      return void dispatch.donation.failure(new Error("Unable to determine donation type."));
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
