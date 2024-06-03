import { dispatch, useTypedSelector } from "@/app/_store";

import { PROFILE_DEFAULTS } from "../constants";
import { Profile } from "../models";

export const useProfile = (projectId: string): Profile =>
  useTypedSelector((state) => state.profiles[projectId] || PROFILE_DEFAULTS);

export const toggleDao = (toggle: boolean) =>
  dispatch.nav.update({
    toggle,
  });

export const updateAccountId = (accountId: string) =>
  dispatch.nav.update({
    accountId,
  });
export const updateNadabotVerification = (isNadabotVerified: boolean) =>
  dispatch.nav.update({
    isNadabotVerified,
  });
