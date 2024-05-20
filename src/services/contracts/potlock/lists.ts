import { MemoryCache } from "@wpdas/naxios";

import {
  POTLOCK_LISTS_CONTRACT_ID,
  POTLOCK_REGISTERY_LIST_ID,
} from "@app/constants";

import { naxiosInstance } from "..";
import {
  GetListInput,
  List,
  Registration,
  RegistrationStatus,
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
 */
export const get_lists = () => contractApi.view<{}, List[]>("get_lists");

/**
 * Get single list
 */
export const get_list = (args: GetListInput) =>
  contractApi.view<typeof args, List>("get_list", {
    args,
  });

/**
 * Get Regsiterations for a list
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
 */
export const get_registration = async (args: {
  list_id?: number;
  registrant_id: string;
}) => {
  const regsiterations = await contractApi.view<typeof args, Registration[]>(
    "get_registrations_for_registrant",
    {
      args,
    },
  );
  const regsiteration = regsiterations.find(
    (regsiteration) =>
      regsiteration.list_id === args.list_id || POTLOCK_REGISTERY_LIST_ID,
  );
  return regsiteration;
};

/**
 * Get if a regsiteration is approved
 */
export const is_registration_approved = (args: {
  account_id: string;
  list_id?: number;
  required_status?: RegistrationStatus;
}) =>
  contractApi.view<typeof args, boolean>(
    "is_registered",
    {
      args,
    },
    { useCache: true },
  );
