import { MemoryCache } from "@wpdas/naxios";
import { Config, DirectDonation } from "./interfaces/donate.interfaces";
import { POTLOCK_DONATE_CONTRACT_ID } from "@app/constants";

import { naxiosInstance } from "..";

/**
 * NEAR Contract API
 */
export const contractApi = naxiosInstance.contractApi({
  contractId: POTLOCK_DONATE_CONTRACT_ID,
  cache: new MemoryCache({ expirationTime: 10 }), // 10 seg
});

// READ METHODS

/**
 * Get donate contract config
 */
export const get_config = () => contractApi.view<{}, Config>("get_config");

/**
 * Get direct donations
 */
export const get_donations = (args: { fromIndex?: number; limit?: number }) =>
  contractApi.view<typeof args, DirectDonation[]>("get_donations", {
    args,
  });

/**
 * Get donations for a recipient id
 */
export const get_donations_for_recipient = (args: { recipient_id: string }) =>
  contractApi.view<typeof args, DirectDonation[]>(
    "get_donations_for_recipient",
    {
      args,
    },
  );

/**
 * Get donations for donor id
 */
export const get_donations_for_donor = (args: { donor_id: string }) =>
  contractApi.view<typeof args, DirectDonation[]>("get_donations_for_donor", {
    args,
  });
