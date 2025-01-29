import { useMemo } from "react";

import { prop } from "remeda";

import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { RegistrationStatus, listsContractHooks } from "@/common/contracts/core/lists";
import { sybilResistanceContractHooks } from "@/common/contracts/core/sybil-resistance";
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

  const { isLoading: isHumanVerificationStatusLoading, data: isHuman } =
    sybilResistanceContractHooks.useIsHuman({
      enabled: wallet.isSignedIn,
      accountId: wallet.accountId ?? "noop",
    });

  const { isLoading: isRegistrationLoading, data: registration } =
    listsContractHooks.useRegistration({
      enabled: wallet.isSignedIn,
      listId: PUBLIC_GOODS_REGISTRY_LIST_ID,
      accountId: (isDaoRepresentative ? daoAccountId : wallet.accountId) ?? "noop",
    });

  const isMetadataLoading = isHumanVerificationStatusLoading || isRegistrationLoading;

  console.log("WALLET in SESSION", wallet);

  return useMemo(() => {
    if (wallet.isReady && wallet.isSignedIn && wallet.accountId) {
      return {
        hasWalletReady: true,
        accountId: wallet.accountId,
        isSignedIn: true,

        ...(isDaoRepresentative
          ? { isDaoRepresentative, daoAccountId }
          : { isDaoRepresentative: false, daoAccountId: undefined }),

        isHuman: isHuman ?? false,
        isMetadataLoading,
        hasRegistrationSubmitted: registration !== undefined,
        hasRegistrationApproved: registration?.status === RegistrationStatus.Approved,
        registrationStatus: registration?.status,
      };
    } else if (wallet.isReady && !wallet.isSignedIn) {
      return {
        hasWalletReady: true,
        accountId: undefined,
        daoAccountId: undefined,
        isSignedIn: false,
        isDaoRepresentative: false,
        isHuman: false,
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
        isHuman: false,
        isMetadataLoading: false,
        hasRegistrationSubmitted: false,
        hasRegistrationApproved: false,
        registrationStatus: undefined,
      };
    }
  }, [
    daoAccountId,
    isDaoRepresentative,
    isHuman,
    isMetadataLoading,
    registration,
    wallet.accountId,
    wallet.isReady,
    wallet.isSignedIn,
  ]);
};
