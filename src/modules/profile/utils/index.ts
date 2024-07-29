import { dispatch, useTypedSelector } from "@/store";

import { PROFILE_DEFAULTS } from "../constants";
import { Profile } from "../models";

export const useProfile = (projectId: string): Profile =>
  useTypedSelector((state) => state.profile[projectId] || PROFILE_DEFAULTS);

export const updateAccountId = (accountId: string) =>
  dispatch.nav.update({
    accountId,
  });
export const updateNadabotVerification = (isNadabotVerified: boolean) =>
  dispatch.nav.update({
    isNadabotVerified,
  });

// Act as DAO handlers
export const toggleDao = (toggle: boolean) =>
  dispatch.nav.updateActAsDao({
    toggle,
  });

export const markDaoAsDefault = (daoAddress: string) =>
  dispatch.nav.updateActAsDao({
    defaultAddress: daoAddress,
  });
export const addOrRemoveDaoAddress = (addresses: string[]) =>
  dispatch.nav.updateActAsDao({
    addresses,
  });
