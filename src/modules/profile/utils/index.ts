import { dispatch, useTypedSelector } from "@/app/_store";

import { DEFAULT_USER } from "../constants";

export const useUser = (projectId: string) =>
  useTypedSelector((state) => state.user[projectId] || DEFAULT_USER);

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
