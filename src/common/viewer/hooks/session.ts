import { useMemo } from "react";

import { prop } from "remeda";

import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { RegistrationStatus, listsContractHooks } from "@/common/contracts/core/lists";
import { isAccountId } from "@/common/lib";
import { useGlobalStoreSelector } from "@/store";

import { useWalletContextStore } from "../internal/wallet-context";
import { ViewerSession } from "../types";

export const useViewerSession = (): ViewerSession => {
  const wallet = useWalletContextStore();
  const { actAsDao } = useGlobalStoreSelector(prop("nav"));
  const daoAccountId = actAsDao.defaultAddress;
  const isDaoAccountIdValid = useMemo(() => isAccountId(daoAccountId), [daoAccountId]);
  const isDaoRepresentative = actAsDao.toggle && isDaoAccountIdValid;

  const { isLoading: isRegistrationLoading, data: registration } =
    listsContractHooks.useRegistration({
      enabled: wallet.isSignedIn,
      listId: PUBLIC_GOODS_REGISTRY_LIST_ID,
      accountId: (isDaoRepresentative ? daoAccountId : wallet.accountId) ?? "noop",
    });

  console.log("WALLET in SESSION", wallet);

  return useMemo(() => {
    if (wallet.isReady && wallet.isSignedIn && wallet.accountId) {
      return {
        hasWalletReady: true,
        accountId: wallet.accountId,
        isSignedIn: true,
        isMetadataLoading: isRegistrationLoading,
        hasRegistrationSubmitted: registration !== undefined,
        hasRegistrationApproved: registration?.status === RegistrationStatus.Approved,
        registrationStatus: registration?.status,

        ...(isDaoRepresentative
          ? { isDaoRepresentative, daoAccountId }
          : { isDaoRepresentative: false, daoAccountId: undefined }),
      };
    } else if (wallet.isReady && !wallet.isSignedIn) {
      return {
        hasWalletReady: true,
        accountId: undefined,
        daoAccountId: undefined,
        isSignedIn: false,
        isDaoRepresentative: false,
        isMetadataLoading: false,
        hasRegistrationSubmitted: false,
        hasRegistrationApproved: false,
        registrationStatus: undefined,
      };
    } else {
      return {
        hasWalletReady: false,
        accountId: undefined,
        daoAccountId: undefined,
        isSignedIn: false,
        isDaoRepresentative: false,
        isMetadataLoading: false,
        hasRegistrationSubmitted: false,
        hasRegistrationApproved: false,
        registrationStatus: undefined,
      };
    }
  }, [
    daoAccountId,
    isDaoRepresentative,
    isRegistrationLoading,
    registration,
    wallet.accountId,
    wallet.isReady,
    wallet.isSignedIn,
  ]);
};
