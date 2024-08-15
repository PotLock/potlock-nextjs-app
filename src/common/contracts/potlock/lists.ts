import { MemoryCache } from "@wpdas/naxios";

import {
  POTLOCK_LISTS_CONTRACT_ID,
  POTLOCK_REGISTRY_LIST_ID,
} from "@/common/constants";
import { floatToYoctoNear } from "@/common/lib";

import {
  ApplyToList,
  GetListInput,
  List,
  Registration,
  RegistrationStatus,
} from "./interfaces/lists.interfaces";
import { naxiosInstance } from "..";

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
export const getLists = () => contractApi.view<{}, List[]>("get_lists");

export const get_admin_list = () =>
  contractApi.view<{}, List[]>("list_admins_by_list_id", {
    args: { list_id: POTLOCK_REGISTRY_LIST_ID, accountId: "harrydhillon.near" },
  });

export const create_list = ({
  name,
  description,
  admins,
  image_cover_url,
}: {
  name: string;
  description: string;
  admins: Array<string>;
  image_cover_url?: string;
}) =>
  contractApi.call<{}, List[]>("create_list", {
    args: {
      name,
      description,
      admins,
      cover_image_url: image_cover_url ?? "",
      admin_only_registrations: false,
      default_registration_status: "Approved",
    },
    deposit: floatToYoctoNear(0.015),
    gas: "300000000000000",
  });

export const update_list = ({
  name,
  description,
  admins,
  list_id,
  image_cover_url,
}: {
  name: string;
  description: string;
  admins: Array<string>;
  list_id: number;
  image_cover_url?: string;
}) =>
  contractApi.call<{}, List[]>("update_list", {
    args: {
      list_id,
      name,
      description,
      cover_image_url: image_cover_url ?? "",
      admins,
      admin_only_registrations: false,
      default_registration_status: "Approved",
    },
    deposit: floatToYoctoNear(0.015),
    gas: "300000000000000",
  });

/**
 * Get single list
 */
export const getList = (args: GetListInput) =>
  contractApi.view<typeof args, List>("get_list", {
    args,
  });

export const registerBatch = (args: ApplyToList) =>
  contractApi.call<typeof args, ApplyToList>("register_batch", {
    deposit: floatToYoctoNear(0.015),
    gas: "300000000000000",
    args,
  });

export const upvote = (args: { list_id: number }) =>
  contractApi.call<typeof args, List>("upvote", {
    args,
    deposit: floatToYoctoNear(0.01),
    gas: "300000000000000",
  });

export const remove_upvote = (args: { list_id: number }) =>
  contractApi.call<typeof args, List>("remove_upvote", {
    args,
    deposit: floatToYoctoNear(0.01),
    gas: "300000000000000",
  });

export const get_list_for_owner = (args: { owner_id: string }) =>
  contractApi.view<typeof args, List>("get_lists_for_owner", {
    args,
  });

export const get_upvoted_lists_for_account = (args: { account_id: string }) =>
  contractApi.view<typeof args, List>("get_upvoted_lists_for_account", {
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
