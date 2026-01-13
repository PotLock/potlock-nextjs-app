import { DONATION_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { contractApi } from "@/common/blockchains/near-protocol/client";
import { FULL_TGAS } from "@/common/constants";
import type { IndivisibleUnits } from "@/common/types";

import {
  DirectBatchDonationItem,
  DirectDonation,
  DirectDonationArgs,
  DirectDonationConfig,
} from "./interfaces";

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

export const donate = (args: DirectDonationArgs, depositAmountYocto: IndivisibleUnits) =>
  donationContractApi.call<typeof args, DirectDonation>("donate", {
    args,
    deposit: depositAmountYocto,
    gas: FULL_TGAS,
    callbackUrl: window.location.href,
  });

export const donateBatch = (txInputs: DirectBatchDonationItem[]) =>
  donationContractApi.callMultiple<DirectDonationArgs>(
    txInputs.map(({ amountYoctoNear, ...txInput }) => ({
      method: "donate",
      deposit: amountYoctoNear,
      gas: FULL_TGAS,

      ...txInput,
    })),
  );

export const storage_deposit = (depositAmountYocto: IndivisibleUnits) =>
  donationContractApi.call<{}, IndivisibleUnits>("storage_deposit", {
    deposit: depositAmountYocto,
    args: {},
    gas: "100000000000000",
  });
