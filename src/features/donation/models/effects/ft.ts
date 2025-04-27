import { ONE_YOCTO } from "@builddao/near-social-js";
import { Big } from "big.js";
import type { ExecutionStatus } from "near-api-js/lib/providers/provider";

import { DONATION_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import {
  type InformativeSuccessfulExecutionOutcome,
  nearProtocolClient,
} from "@/common/blockchains/near-protocol";
import { FULL_TGAS, NATIVE_TOKEN_DECIMALS } from "@/common/constants";
import { type DirectDonation, donationContractClient } from "@/common/contracts/core/donation";
import type { FungibleTokenMetadata, FungibleTokenStorageBalance } from "@/common/contracts/tokens";
import { bigNumToIndivisible, floatToIndivisible, indivisibleUnitsToBigNum } from "@/common/lib";
import type { AccountId } from "@/common/types";

import { DONATION_BASE_STORAGE_DEPOSIT_FLOAT } from "../../constants";
import type { DonationSubmitParams } from "../schemas";

type DonationFtMulticallInputs = Pick<
  DonationSubmitParams,
  "amount" | "referrerAccountId" | "bypassProtocolFee" | "message" | "tokenId"
> & { recipientAccountId: AccountId };

export const donationFtMulticall = async ({
  amount,
  recipientAccountId,
  referrerAccountId,
  bypassProtocolFee,
  message,
  tokenId,
}: DonationFtMulticallInputs): Promise<DirectDonation> => {
  const { protocol_fee_recipient_account: protocolFeeRecipientAccountId } =
    await donationContractClient.get_config();

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
    tokenClient
      .view<
        { account_id: AccountId },
        FungibleTokenStorageBalance | null
      >("storage_balance_of", { args: { account_id: protocolFeeRecipientAccountId } })
      .then((response) =>
        indivisibleUnitsToBigNum(response?.total ?? String(0), NATIVE_TOKEN_DECIMALS),
      ),

    /**
     *? Checking the FT contract storage balance of the donation contract account
     */
    tokenClient
      .view<
        { account_id: AccountId },
        FungibleTokenStorageBalance | null
      >("storage_balance_of", { args: { account_id: DONATION_CONTRACT_ACCOUNT_ID } })
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
        recipientFtStorageBalanceBig,
      ]) =>
        donationContractClient
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
                      args: { account_id: DONATION_CONTRACT_ACCOUNT_ID },
                      gas: "100000000000000",

                      deposit: bigNumToIndivisible(
                        maxFtStorageBalanceBig.minus(donationContractFtStorageBalanceBig),
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
                  receiver_id: DONATION_CONTRACT_ACCOUNT_ID,
                  amount: floatToIndivisible(amount, ftMetadata.decimals),

                  msg: JSON.stringify({
                    recipient_id: recipientAccountId,
                    referrer_id: referrerAccountId || null,
                    bypass_protocol_fee: bypassProtocolFee,
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
      const receipt: DirectDonation | undefined = finalExecutionOutcomes
        ?.at(-1)
        ?.receipts_outcome.filter(
          ({ outcome: { executor_id, status } }) =>
            executor_id === DONATION_CONTRACT_ACCOUNT_ID &&
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
            if (decodedReceipt.includes(recipientAccountId)) {
              try {
                return [JSON.parse(decodedReceipt) as DirectDonation];
              } catch {
                return acc;
              }
            } else return acc;
          },

          [] as DirectDonation[],
        )
        .at(0);

      if (receipt !== undefined) {
        return receipt;
      } else throw new Error("Unable to determine transaction execution status.");
    });
};
