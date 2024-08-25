import { MemoryCache } from "@wpdas/naxios";

import { naxiosInstance } from "@/common/api/near";
import {
  LISTS_CONTRACT_ID,
  POTLOCK_REGISTRY_LIST_ID,
} from "@/common/constants";

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
  contractId: LISTS_CONTRACT_ID,
  cache: new MemoryCache({ expirationTime: 10 }), // 10 seg
});

// READ METHODS

/**
 * Get lists
 */
export const getLists = () => contractApi.view<{}, List[]>("get_lists");

/**
 * Get single list
 */
export const getList = (args: GetListInput) =>
  contractApi.view<typeof args, List>("get_list", {
    args,
  });

/**
 * Get Registrations for a list
 */
export const getRegistrations = (
  args: { list_id: number } = { list_id: POTLOCK_REGISTRY_LIST_ID },
) => {
  return contractApi.view<typeof args, Registration[]>(
    "get_registrations_for_list",
    {
      args,
    },
    { useCache: true },
  );
};

/**
 * Get Registrations for registrant
 */
export const getRegistration = async (args: {
  list_id?: number;
  registrant_id: string;
}) => {
  const registrations = await contractApi.view<typeof args, Registration[]>(
    "get_registrations_for_registrant",
    {
      args,
    },
  );
  const registration = registrations.find(
    (registration) =>
      registration.list_id === args.list_id || POTLOCK_REGISTRY_LIST_ID,
  );
  return registration;
};

/**
 * Check if a registration is approved
 */
export const isRegistrationApproved = (args: {
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
