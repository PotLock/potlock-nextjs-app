import { ONE_YOCTO } from "@builddao/near-social-js";
import type { Transaction } from "@wpdas/naxios";
import { Big } from "big.js";

import { DONATION_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { nearProtocolClient } from "@/common/blockchains/near-protocol";
import { FULL_TGAS, NATIVE_TOKEN_DECIMALS } from "@/common/constants";
import { donationContractClient } from "@/common/contracts/core/donation";
import type { FungibleTokenMetadata } from "@/common/contracts/tokens";
import { bigNumToIndivisible, floatToIndivisible, indivisibleUnitsToBigNum } from "@/common/lib";
import type { AccountId } from "@/common/types";

import { DONATION_BASE_STORAGE_DEPOSIT_FLOAT } from "../../constants";
import type { DonationSubmitParams } from "../schemas";

type FtDonationInputs = { recipientAccountId: AccountId } & Pick<
  DonationSubmitParams,
  "amount" | "referrerAccountId" | "bypassProtocolFee" | "message" | "tokenId"
>;

export const processFtDonation = async ({
  amount,
  recipientAccountId,
  referrerAccountId,
  bypassProtocolFee,
  message,
  tokenId,
}: FtDonationInputs) => {
  const { protocol_fee_recipient_account } = await donationContractClient.getConfig();

  const tokenClient = nearProtocolClient.naxiosInstance.contractApi({ contractId: tokenId });

  const requiredDepositNear = Big(DONATION_BASE_STORAGE_DEPOSIT_FLOAT).plus(
    /* Additional 0.0001 NEAR per message character */
    Big(0.0001).mul(Big(message?.length ?? 0)),
  );

  const referrerStorageBalance = referrerAccountId
    ? await tokenClient.view<{ account_id: AccountId }, { total: string; available: string }>(
        "storage_balance_of",
        { args: { account_id: referrerAccountId } },
      )
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
      { args: { account_id: protocol_fee_recipient_account } },
    ),

    tokenClient.view<{ account_id: AccountId }, { total: string; available: string }>(
      "storage_balance_of",
      { args: { account_id: DONATION_CONTRACT_ACCOUNT_ID } },
    ),

    tokenClient.view<{ account_id: AccountId }, { total: string; available: string }>(
      "storage_balance_of",
      { args: { account_id: recipientAccountId } },
    ),
  ]);

  const maxFtStorageBalanceBig =
    ftStorageBalanceBounds === null
      ? null
      : indivisibleUnitsToBigNum(ftStorageBalanceBounds.max, NATIVE_TOKEN_DECIMALS);

  const protocolFeeRecipientFtStorageBalanceBig =
    protocolFeeRecipientFtStorageBalance === null
      ? null
      : indivisibleUnitsToBigNum(protocolFeeRecipientFtStorageBalance.total, NATIVE_TOKEN_DECIMALS);

  const referrerStorageBalanceBig =
    referrerStorageBalance === null
      ? null
      : indivisibleUnitsToBigNum(referrerStorageBalance.total, NATIVE_TOKEN_DECIMALS);

  const donationContractFtStorageBalanceBig =
    donationContractFtStorageBalance === null
      ? null
      : indivisibleUnitsToBigNum(donationContractFtStorageBalance.total, NATIVE_TOKEN_DECIMALS);

  const recipientFtStorageBalanceBig =
    recipientFtStorageBalance === null
      ? null
      : indivisibleUnitsToBigNum(recipientFtStorageBalance.total, NATIVE_TOKEN_DECIMALS);

  const protocolFeeRecipientStorageDeposit =
    !bypassProtocolFee &&
    maxFtStorageBalanceBig !== null &&
    protocolFeeRecipientFtStorageBalanceBig !== null &&
    protocolFeeRecipientFtStorageBalanceBig.lt(maxFtStorageBalanceBig)
      ? bigNumToIndivisible(
          maxFtStorageBalanceBig.minus(protocolFeeRecipientFtStorageBalanceBig),
          NATIVE_TOKEN_DECIMALS,
        )
      : null;

  const referrerStorageDeposit =
    referrerAccountId &&
    maxFtStorageBalanceBig !== null &&
    referrerStorageBalanceBig !== null &&
    referrerStorageBalanceBig.lt(maxFtStorageBalanceBig)
      ? bigNumToIndivisible(
          maxFtStorageBalanceBig.minus(referrerStorageBalanceBig),
          NATIVE_TOKEN_DECIMALS,
        )
      : null;

  const donationContractStorageDeposit =
    maxFtStorageBalanceBig !== null &&
    donationContractFtStorageBalanceBig !== null &&
    donationContractFtStorageBalanceBig.lt(maxFtStorageBalanceBig)
      ? bigNumToIndivisible(
          maxFtStorageBalanceBig.minus(donationContractFtStorageBalanceBig),
          NATIVE_TOKEN_DECIMALS,
        )
      : null;

  const ftContractStorageDeposit =
    maxFtStorageBalanceBig !== null &&
    recipientFtStorageBalanceBig !== null &&
    recipientFtStorageBalanceBig.lt(maxFtStorageBalanceBig)
      ? bigNumToIndivisible(
          maxFtStorageBalanceBig?.minus(recipientFtStorageBalanceBig),
          NATIVE_TOKEN_DECIMALS,
        )
      : null;

  const transactions: Transaction<object>[] = [
    /**
     *? FT storage balance replenishment for protocol fee recipient account
     */
    ...(protocolFeeRecipientStorageDeposit !== null
      ? [
          {
            method: "storage_deposit",
            args: { account_id: protocol_fee_recipient_account },
            deposit: protocolFeeRecipientStorageDeposit,
            gas: "100000000000000",
          },
        ]
      : []),

    /**
     *? FT contract storage balance replenishment for referrer account
     */
    ...(referrerStorageDeposit !== null
      ? [
          {
            method: "storage_deposit",
            args: { account_id: referrerAccountId },
            deposit: referrerStorageDeposit,
            gas: "100000000000000",
          },
        ]
      : []),

    /**
     *? FT contract storage balance replenishment for donation contract account
     */
    ...(donationContractStorageDeposit !== null
      ? [
          {
            method: "storage_deposit",
            args: { account_id: DONATION_CONTRACT_ACCOUNT_ID },
            deposit: donationContractStorageDeposit,
            gas: "100000000000000",
          },
        ]
      : []),

    /**
     *? FT contract storage balance replenishment for donation recipient account
     */
    ...(ftContractStorageDeposit !== null
      ? [
          {
            method: "storage_deposit",
            args: { account_id: recipientAccountId },
            deposit: ftContractStorageDeposit,
            gas: "100000000000000",
          },
        ]
      : []),

    {
      method: "ft_transfer_call",

      args: {
        receiver_id: DONATION_CONTRACT_ACCOUNT_ID,
        amount: floatToIndivisible(amount, ftMetadata?.decimals ?? NATIVE_TOKEN_DECIMALS),

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
  ];

  return donationContractClient
    .storage_deposit(bigNumToIndivisible(requiredDepositNear, NATIVE_TOKEN_DECIMALS))
    .then((_updatedStorageBalance) => tokenClient.callMultiple(transactions));
};
