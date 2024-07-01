import { dispatch } from "@/app/_store";

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
