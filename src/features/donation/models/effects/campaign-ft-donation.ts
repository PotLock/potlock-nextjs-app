import { ONE_YOCTO } from "@builddao/near-social-js";
import { Big } from "big.js";
import type { ExecutionStatus } from "near-api-js/lib/providers/provider";

import { CAMPAIGNS_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import {
  type InformativeSuccessfulExecutionOutcome,
  nearProtocolClient,
} from "@/common/blockchains/near-protocol";
import { FULL_TGAS, NATIVE_TOKEN_DECIMALS, NOOP_BALANCE_VIEW } from "@/common/constants";
import { type CampaignDonation, campaignsContractClient } from "@/common/contracts/core/campaigns";
import type { FungibleTokenMetadata, FungibleTokenStorageBalance } from "@/common/contracts/tokens";
import { bigNumToIndivisible, floatToIndivisible, indivisibleUnitsToBigNum } from "@/common/lib";
import type { AccountId, CampaignId } from "@/common/types";

import { DONATION_BASE_STORAGE_DEPOSIT_FLOAT } from "../../constants";
import type { DonationSubmitParams } from "../schemas";

type CampaignFtDonationMulticallInputs = Pick<
  DonationSubmitParams,
  "amount" | "referrerAccountId" | "bypassProtocolFee" | "message" | "tokenId"
> & {
  campaignId: CampaignId;
  recipientAccountId: AccountId;
  creatorAccountId: AccountId;
  bypassCreatorFee: boolean;
};

export const campaignFtDonationMulticall = async ({
  amount,
  campaignId,
  recipientAccountId,
  creatorAccountId,
  referrerAccountId,
  bypassProtocolFee,
  bypassCreatorFee,
  message,
  tokenId,
}: CampaignFtDonationMulticallInputs): Promise<CampaignDonation> => {
  const { protocol_fee_recipient_account: protocolFeeRecipientAccountId } =
    await campaignsContractClient.get_config();

  const tokenClient = nearProtocolClient.naxiosInstance.contractApi({ contractId: tokenId });

  const donationContractStorageDeposit = Big(DONATION_BASE_STORAGE_DEPOSIT_FLOAT).plus(
    /* Additional 0.0001 NEAR per message character */
    Big(0.0001).mul(Big(message?.length ?? 0)),
  );

  const referrerStorageBalanceBig = referrerAccountId
    ? await tokenClient
        .view<
          { account_id: AccountId },
          FungibleTokenStorageBalance | null
        >("storage_balance_of", { args: { account_id: referrerAccountId } })
        .then((response) =>
          indivisibleUnitsToBigNum(response?.total ?? String(0), NATIVE_TOKEN_DECIMALS),
        )
    : null;

  return Promise.all([
    tokenClient.view<{}, FungibleTokenMetadata>("ft_metadata"),

    tokenClient
      .view<{}, { min: string; max: string }>("storage_balance_bounds")
      .then(({ max }) => indivisibleUnitsToBigNum(max, NATIVE_TOKEN_DECIMALS)),

    /**
     *? Checking the FT contract storage balance of the protocol fee recipient account
     */
    bypassProtocolFee
      ? NOOP_BALANCE_VIEW
      : tokenClient
          .view<
            { account_id: AccountId },
            FungibleTokenStorageBalance | null
          >("storage_balance_of", { args: { account_id: protocolFeeRecipientAccountId } })
          .then((response) =>
            indivisibleUnitsToBigNum(response?.total ?? String(0), NATIVE_TOKEN_DECIMALS),
          ),

    /**
     *? Checking the FT contract storage balance of the campaigns contract account
     */
    tokenClient
      .view<
        { account_id: AccountId },
        FungibleTokenStorageBalance | null
      >("storage_balance_of", { args: { account_id: CAMPAIGNS_CONTRACT_ACCOUNT_ID } })
      .then((response) =>
        indivisibleUnitsToBigNum(response?.total ?? String(0), NATIVE_TOKEN_DECIMALS),
      ),

    /**
     *? Checking the FT contract storage balance of the campaign creator account
     */
    bypassCreatorFee
      ? NOOP_BALANCE_VIEW
      : tokenClient
          .view<
            { account_id: AccountId },
            FungibleTokenStorageBalance | null
          >("storage_balance_of", { args: { account_id: creatorAccountId } })
          .then((response) =>
            indivisibleUnitsToBigNum(response?.total ?? String(0), NATIVE_TOKEN_DECIMALS),
          ),

    /**
     *? Checking the FT contract storage balance of the donation recipient account
     */
    tokenClient
      .view<
        { account_id: AccountId },
        FungibleTokenStorageBalance | null
      >("storage_balance_of", { args: { account_id: recipientAccountId } })
      .then((response) =>
        indivisibleUnitsToBigNum(response?.total ?? String(0), NATIVE_TOKEN_DECIMALS),
      ),
  ])
    .then(
      ([
        ftMetadata,
        maxFtStorageBalanceBig,
        protocolFeeRecipientFtStorageBalanceBig,
        donationContractFtStorageBalanceBig,
        creatorFtStorageBalanceBig,
        recipientFtStorageBalanceBig,
      ]) =>
        campaignsContractClient
          .storage_deposit(
            bigNumToIndivisible(donationContractStorageDeposit, NATIVE_TOKEN_DECIMALS),
          )
          .then((_updatedDonationContractStorageBalance) =>
            tokenClient.callMultiple([
              /**
               *? FT contract storage balance replenishment for the protocol fee recipient account
               */
              ...(!bypassProtocolFee &&
              protocolFeeRecipientFtStorageBalanceBig.lt(maxFtStorageBalanceBig)
                ? [
                    {
                      method: "storage_deposit",
                      args: { account_id: protocolFeeRecipientAccountId },
                      gas: "100000000000000",

                      deposit: bigNumToIndivisible(
                        maxFtStorageBalanceBig.minus(protocolFeeRecipientFtStorageBalanceBig),
                        NATIVE_TOKEN_DECIMALS,
                      ),
                    },
                  ]
                : []),

              /**
               *? FT contract storage balance replenishment for the referrer account
               */
              ...(referrerStorageBalanceBig !== null &&
              referrerStorageBalanceBig.lt(maxFtStorageBalanceBig)
                ? [
                    {
                      method: "storage_deposit",
                      args: { account_id: referrerAccountId },
                      gas: "100000000000000",

                      deposit: bigNumToIndivisible(
                        maxFtStorageBalanceBig.minus(referrerStorageBalanceBig),
                        NATIVE_TOKEN_DECIMALS,
                      ),
                    },
                  ]
                : []),

              /**
               *? FT contract storage balance replenishment for the donation contract account
               */
              ...(donationContractFtStorageBalanceBig.lt(maxFtStorageBalanceBig)
                ? [
                    {
                      method: "storage_deposit",
                      args: { account_id: CAMPAIGNS_CONTRACT_ACCOUNT_ID },
                      gas: "100000000000000",

                      deposit: bigNumToIndivisible(
                        maxFtStorageBalanceBig.minus(donationContractFtStorageBalanceBig),
                        NATIVE_TOKEN_DECIMALS,
                      ),
                    },
                  ]
                : []),

              /**
               *? FT contract storage balance replenishment for the campaign creator account
               */
              ...(!bypassCreatorFee && creatorFtStorageBalanceBig.lt(maxFtStorageBalanceBig)
                ? [
                    {
                      method: "storage_deposit",
                      args: { account_id: creatorAccountId },
                      gas: "100000000000000",

                      deposit: bigNumToIndivisible(
                        maxFtStorageBalanceBig.minus(creatorFtStorageBalanceBig),
                        NATIVE_TOKEN_DECIMALS,
                      ),
                    },
                  ]
                : []),

              /**
               *? FT contract storage balance replenishment for the donation recipient account
               */
              ...(recipientFtStorageBalanceBig.lt(maxFtStorageBalanceBig)
                ? [
                    {
                      method: "storage_deposit",
                      args: { account_id: recipientAccountId },
                      gas: "100000000000000",

                      deposit: bigNumToIndivisible(
                        maxFtStorageBalanceBig.minus(recipientFtStorageBalanceBig),
                        NATIVE_TOKEN_DECIMALS,
                      ),
                    },
                  ]
                : []),

              {
                method: "ft_transfer_call",

                args: {
                  receiver_id: CAMPAIGNS_CONTRACT_ACCOUNT_ID,
                  amount: floatToIndivisible(amount, ftMetadata.decimals),

                  msg: JSON.stringify({
                    campaign_id: campaignId,
                    referrer_id: referrerAccountId || null,
                    bypass_protocol_fee: bypassProtocolFee,
                    bypass_creator_fee: bypassCreatorFee,
                    message,
                  }),
                },

                deposit: ONE_YOCTO,
                gas: FULL_TGAS,
              },
            ]),
          ),
    )
    .then((finalExecutionOutcomes = undefined) => {
      const receipt: CampaignDonation | undefined = finalExecutionOutcomes
        ?.at(-1)
        ?.receipts_outcome.filter(
          ({ outcome: { executor_id, status } }) =>
            executor_id === CAMPAIGNS_CONTRACT_ACCOUNT_ID &&
            "SuccessValue" in (status as ExecutionStatus) &&
            typeof (status as ExecutionStatus).SuccessValue === "string",
        )
        .reduce(
          (acc, { outcome }) => {
            const decodedReceipt = atob(
              (outcome as InformativeSuccessfulExecutionOutcome).status.SuccessValue,
            );

            /**
             *? Checking for the donation receipt signature
             */
            if (decodedReceipt.includes(campaignId.toString())) {
              try {
                return [JSON.parse(decodedReceipt) as CampaignDonation];
              } catch {
                return acc;
              }
            } else return acc;
          },

          [] as CampaignDonation[],
        )
        .at(0);

      if (receipt !== undefined) {
        return receipt;
      } else throw new Error("Unable to determine transaction execution status.");
    });
};
