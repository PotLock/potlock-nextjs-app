import { MemoryCache } from "@wpdas/naxios";

import { DONATION_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { naxiosInstance } from "@/common/blockchains/near-protocol/client";
import { FULL_TGAS } from "@/common/constants";

import {
  DirectBatchDonationItem,
  DirectDonation,
  DirectDonationArgs,
  DirectDonationConfig,
} from "./interfaces";

const contractApi = naxiosInstance.contractApi({
  contractId: DONATION_CONTRACT_ACCOUNT_ID,
  cache: new MemoryCache({ expirationTime: 10 }), // 10 seg
});

// READ METHODS

/**
 * Get donate contract config
 */
export const get_config = () => contractApi.view<{}, DirectDonationConfig>("get_config");

/**
 * Get direct donations
 */
export const getDonations = (args: { fromIndex?: number; limit?: number }) =>
  contractApi.view<typeof args, DirectDonation[]>("get_donations", { args });

/**
 * Get donations for a recipient id
 */
export const getDonationsForRecipient = (args: { recipient_id: string }) =>
  contractApi.view<typeof args, DirectDonation[]>("get_donations_for_recipient", { args });

/**
 * Get donations for donor id
 */
export const get_donations_for_donor = (args: { donor_id: string }) =>
  contractApi.view<typeof args, DirectDonation[]>("get_donations_for_donor", {
    args,
  });

export const donate = (args: DirectDonationArgs, depositAmountYocto: string) =>
  contractApi.call<typeof args, DirectDonation>("donate", {
    args,
    deposit: depositAmountYocto,
    gas: FULL_TGAS,
    callbackUrl: window.location.href,
  });

export const donateBatch = (txInputs: DirectBatchDonationItem[]) =>
  contractApi.callMultiple<DirectDonationArgs>(
    txInputs.map(({ amountYoctoNear, ...txInput }) => ({
      method: "donate",
      deposit: amountYoctoNear,
      gas: FULL_TGAS,

      ...txInput,
    })),
  );

export const storage_deposit = (depositAmountYocto: string) =>
  contractApi.call<{}, string>("storage_deposit", {
    deposit: depositAmountYocto,
    args: {},
    gas: "100000000000000",
  });
