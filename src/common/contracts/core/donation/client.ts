import { DONATION_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { contractApi, walletApi } from "@/common/blockchains/near-protocol/client";
import { FULL_TGAS } from "@/common/constants";
import type { IndivisibleUnits } from "@/common/types";

import {
  DirectBatchDonationItem,
  DirectDonation,
  DirectDonationArgs,
  DirectDonationConfig,
} from "./interfaces";

export type DirectDonateResult = {
  donation: DirectDonation;
  txHash: string | null;
};

const donationContractApi = contractApi({
  contractId: DONATION_CONTRACT_ACCOUNT_ID,
});

// READ METHODS

/**
 * Get donate contract config
 */
export const get_config = () => donationContractApi.view<{}, DirectDonationConfig>("get_config");

/**
 * Get direct donations
 */
export const get_donations = (args: { fromIndex?: number; limit?: number }) =>
  donationContractApi.view<typeof args, DirectDonation[]>("get_donations", { args });

/**
 * Get donations for a recipient id
 */
export const get_donations_for_recipient = (args: { recipient_id: string }) =>
  donationContractApi.view<typeof args, DirectDonation[]>("get_donations_for_recipient", { args });

/**
 * Get donations for donor id
 */
export const get_donations_for_donor = (args: { donor_id: string }) =>
  donationContractApi.view<typeof args, DirectDonation[]>("get_donations_for_donor", {
    args,
  });

export const donate = async (
  args: DirectDonationArgs,
  depositAmountYocto: IndivisibleUnits,
): Promise<DirectDonateResult> => {
  const wallet = await walletApi.ensureWallet();
  const signerId = walletApi.accountId;

  if (!signerId) {
    throw new Error("Wallet is not signed in.");
  }

  const { actionCreators } = await import("@near-js/transactions");
  const { providers } = await import("near-api-js");

  const action = actionCreators.functionCall(
    "donate",
    args,
    BigInt(FULL_TGAS),
    BigInt(depositAmountYocto),
  );

  let outcome: any;
  const walletAny = wallet as any;

  if ("signAndSendTransaction" in walletAny) {
    outcome = await walletAny.signAndSendTransaction({
      signerId,
      receiverId: DONATION_CONTRACT_ACCOUNT_ID,
      actions: [action],
    });
  } else if ("signAndSendTransactions" in walletAny) {
    const results = await walletAny.signAndSendTransactions({
      transactions: [
        {
          receiverId: DONATION_CONTRACT_ACCOUNT_ID,
          actions: [action],
        },
      ],
    });

    outcome = Array.isArray(results) ? results[0] : results;
  } else {
    throw new Error("Wallet does not support transaction signing");
  }

  const txHash = outcome?.transaction?.hash || outcome?.transaction_outcome?.id || null;
  const donation = providers.getTransactionLastResult(outcome) as DirectDonation;

  return { donation, txHash };
};

export type DirectBatchDonateResult = {
  donations: DirectDonation[];
  txHash: string | null;
};

export const donateBatch = async (
  txInputs: DirectBatchDonationItem[],
): Promise<DirectBatchDonateResult> => {
  const wallet = await walletApi.ensureWallet();
  const signerId = walletApi.accountId;

  if (!signerId) {
    throw new Error("Wallet is not signed in.");
  }

  const { actionCreators } = await import("@near-js/transactions");
  const { providers } = await import("near-api-js");

  // Create actions for each donation
  const actions = txInputs.map(({ amountYoctoNear, args }) =>
    actionCreators.functionCall("donate", args, BigInt(FULL_TGAS), BigInt(amountYoctoNear)),
  );

  let outcome: any;
  const walletAny = wallet as any;

  if ("signAndSendTransaction" in walletAny) {
    // Single transaction with multiple actions
    outcome = await walletAny.signAndSendTransaction({
      signerId,
      receiverId: DONATION_CONTRACT_ACCOUNT_ID,
      actions,
    });
  } else if ("signAndSendTransactions" in walletAny) {
    // For wallets that only support signAndSendTransactions
    const results = await walletAny.signAndSendTransactions({
      transactions: [
        {
          receiverId: DONATION_CONTRACT_ACCOUNT_ID,
          actions,
        },
      ],
    });

    outcome = Array.isArray(results) ? results[0] : results;
  } else {
    throw new Error("Wallet does not support transaction signing");
  }

  const txHash = outcome?.transaction?.hash || outcome?.transaction_outcome?.id || null;

  // Parse all donations from the outcome
  const donations: DirectDonation[] = [];

  if (outcome?.receipts_outcome) {
    for (const receipt of outcome.receipts_outcome) {
      const successValue = receipt?.outcome?.status?.SuccessValue;

      if (successValue) {
        try {
          const parsed = JSON.parse(atob(successValue));

          if (parsed && "recipient_id" in parsed && "donor_id" in parsed) {
            donations.push(parsed as DirectDonation);
          }
        } catch {
          // Not valid JSON, skip
        }
      }
    }
  }

  // Fallback: try to get last result
  if (donations.length === 0) {
    try {
      const lastResult = providers.getTransactionLastResult(outcome);

      if (lastResult && typeof lastResult === "object" && "recipient_id" in lastResult) {
        donations.push(lastResult as DirectDonation);
      }
    } catch {
      // Ignore
    }
  }

  return { donations, txHash };
};

export const storage_deposit = (depositAmountYocto: IndivisibleUnits) =>
  donationContractApi.call<{}, IndivisibleUnits>("storage_deposit", {
    deposit: depositAmountYocto,
    args: {},
    gas: "100000000000000",
  });
