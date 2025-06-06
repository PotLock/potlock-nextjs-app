import { MemoryCache } from "@wpdas/naxios";

import { LISTS_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { naxiosInstance } from "@/common/blockchains/near-protocol/client";
import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { floatToYoctoNear } from "@/common/lib";
import { AccountId } from "@/common/types";

import {
  ApplyToList,
  GetListArgs,
  List,
  Registration,
  RegistrationStatus,
  UpdateRegistration,
} from "./interfaces";

const contractApi = naxiosInstance.contractApi({
  contractId: LISTS_CONTRACT_ACCOUNT_ID,
  cache: new MemoryCache({ expirationTime: 10 }),
});

export const get_lists = () => contractApi.view<{}, List[]>("get_lists");

export const create_list = ({
  name,
  description,
  admins,
  image_cover_url,
  accounts,
  allowApplications,
}: {
  name: string;
  description: string;
  admins: AccountId[];
  allowApplications?: boolean;
  accounts: { registrant_id: AccountId; status: RegistrationStatus }[];
  image_cover_url?: string | null;
}) => {
  const accountsDeposit = accounts?.length * 0.021;
  return contractApi.call<{}, List[]>("create_list_with_registrations", {
    args: {
      name,
      description,
      admins,
      cover_image_url: image_cover_url ?? null,
      ...(accounts?.length && { registrations: accounts }),
      admin_only_registrations: !allowApplications,
      default_registration_status: RegistrationStatus.Approved,
    },
    deposit: floatToYoctoNear(0.02 + accountsDeposit),
    gas: "300000000000000",
  });
};

export const update_list = ({
  name,
  description,
  admins,
  list_id,
  approveApplications,
  allowApplications,
  image_cover_url,
}: {
  name: string;
  description: string;
  admins: Array<string>;
  list_id: number;
  approveApplications?: boolean;
  allowApplications?: boolean;
  image_cover_url?: string;
}) =>
  contractApi.call<{}, List[]>("update_list", {
    args: {
      list_id,
      name,
      description,
      cover_image_url: image_cover_url ?? null,
      admins,
      admin_only_registrations: !allowApplications,
      default_registration_status: approveApplications
        ? RegistrationStatus.Approved
        : RegistrationStatus.Pending,
    },
    deposit: floatToYoctoNear(0.015),
    gas: "300000000000000",
  });

export const get_list = (args: GetListArgs) =>
  contractApi.view<typeof args, List>("get_list", { args });

export const register_batch = (args: ApplyToList) =>
  contractApi.call<typeof args, ApplyToList>("register_batch", {
    deposit: floatToYoctoNear(0.015 * args.registrations.length),
    gas: "300000000000000",
    args,
  });

export const unregister_from_list = (args: { list_id: number; registration_id: number }) =>
  contractApi.call<typeof args, { list_id: number; registration_id: number }>("unregister", {
    deposit: floatToYoctoNear(0.015),
    gas: "300000000000000",
    args,
  });

export const update_registered_project = (args: UpdateRegistration) =>
  contractApi.call<typeof args, UpdateRegistration>("update_registration", {
    deposit: floatToYoctoNear(0.015),
    gas: "300000000000000",
    args,
  });

export const delete_list = (args: { list_id: number }) =>
  contractApi.call<typeof args, List>("delete_list", {
    args,
    deposit: floatToYoctoNear(0.01),
    gas: "300000000000000",
  });

export const upvote = (args: { list_id: number }) =>
  contractApi.call<typeof args, List>("upvote", {
    args,
    deposit: floatToYoctoNear(0.01),
    gas: "300000000000000",
  });

export const add_admins_to_list = (args: { list_id: number; admins: Array<string> }) =>
  contractApi.call<typeof args, List>("owner_add_admins", {
    args,
    deposit: floatToYoctoNear(0.01),
    gas: "300000000000000",
  });

export const remove_admins_from_list = (args: { list_id: number; admins: Array<string> }) =>
  contractApi.call<typeof args, List>("owner_remove_admins", {
    args,
    deposit: floatToYoctoNear(0.01),
    gas: "300000000000000",
  });

export const transfer_list_ownership = (args: { list_id: number; new_owner_id: string }) =>
  contractApi.call<typeof args, List>("owner_change_owner", {
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
  contractApi.view<typeof args, List>("get_lists_for_owner", { args });

export const get_upvoted_lists_for_account = (args: { account_id: string }) =>
  contractApi.view<typeof args, List>("get_upvoted_lists_for_account", { args });

export type GetRegistrationsForListArgs = {
  list_id: number;
};

export const get_registrations_for_list = (args: GetRegistrationsForListArgs) =>
  contractApi.view<typeof args, Registration[]>("get_registrations_for_list", { args });

export const get_registrations_for_registrant = (args: {
  list_id?: number;
  registrant_id: string;
}) => contractApi.view<typeof args, Registration[]>("get_registrations_for_registrant", { args });

export const getRegistration = async (args: { list_id?: number; registrant_id: string }) =>
  await get_registrations_for_registrant(args).then((registrations) =>
    registrations.find(
      (registration) => registration.list_id === (args.list_id || PUBLIC_GOODS_REGISTRY_LIST_ID),
    ),
  );

export type IsRegisteredArgs = {
  account_id: string;
  list_id?: number;
  required_status?: RegistrationStatus;
};

export const is_registered = (args: IsRegisteredArgs) =>
  contractApi.view<typeof args, boolean>("is_registered", { args });
