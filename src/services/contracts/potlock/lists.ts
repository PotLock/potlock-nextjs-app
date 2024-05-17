import { MemoryCache } from "@wpdas/naxios";
import { Provider } from "near-api-js/lib/providers";

import {
  FULL_TGAS,
  NADABOT_CONTRACT_ID,
  ONE_HUNDREDTH_NEAR,
  POTLOCK_LISTS_CONTRACT_ID,
  TWO_HUNDREDTHS_NEAR,
} from "@app/constants";

import { naxiosInstance } from "..";
import {
  GetListInput,
  List,
  Registration,
} from "./interfaces/lists.interfaces";

/**
 * NEAR Contract API
 */
export const contractApi = naxiosInstance.contractApi({
  contractId: POTLOCK_LISTS_CONTRACT_ID,
  cache: new MemoryCache({ expirationTime: 10 }), // 10 seg
});

// READ METHODS

/**
 * Get lists
 * @returns
 */
export const get_lists = () => contractApi.view<{}, List[]>("get_lists");

/**
 * Get single list
 * @returns
 */
export const get_list = (args: GetListInput) =>
  contractApi.view<typeof args, List>("get_list", {
    args,
  });

/**
 * Get Regsiterations for a list
 * @returns
 */
export const get_registrations = (args: { list_id: number }) =>
  contractApi.view<typeof args, Registration[]>(
    "get_registrations_for_list",
    {
      args,
    },
    { useCache: true },
  );

/**
 * Get Regsiterations for registrant
 * @returns
 */
export const get_registration = (args: { registrant_id: string }) =>
  contractApi.view<typeof args, Registration[]>(
    "get_registrations_for_registrant",
    {
      args,
    },
  );
