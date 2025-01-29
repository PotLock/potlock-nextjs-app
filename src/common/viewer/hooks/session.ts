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
  const isDaoRepresentative = actAsDao.toggle && Boolean(actAsDao.defaultAddress);

  const accountId = useMemo(() => {
    if (wallet.isSignedIn) {
      return isDaoRepresentative ? actAsDao.defaultAddress : wallet.accountId;
    } else return undefined;
  }, [actAsDao.defaultAddress, isDaoRepresentative, wallet.accountId, wallet.isSignedIn]);

  /**
   * Account for edge cases in which the wallet is connected to a mismatching network
   *  ( e.g. testnet account in mainnet-bound environments )
   */
  const isAccountIdValid = useMemo(() => isAccountId(accountId), [accountId]);

  const { isLoading: isRegistrationLoading, data: registration } =
    listsContractHooks.useRegistration({
      enabled: isAccountIdValid,
      accountId: accountId ?? "noop",
      listId: PUBLIC_GOODS_REGISTRY_LIST_ID,
    });

  console.log("WALLET", wallet);

  return useMemo(() => {
    if (wallet.isReady && wallet.isSignedIn && accountId) {
      return {
        hasWalletReady: true,
        accountId,
        isSignedIn: true,
        isDaoRepresentative,
        isMetadataLoading: isRegistrationLoading,
        hasRegistrationSubmitted: registration !== undefined,
        hasRegistrationApproved: registration?.status === RegistrationStatus.Approved,
        registrationStatus: registration?.status,
      };
    } else if (wallet.isReady && !wallet.isSignedIn) {
      return {
        hasWalletReady: true,
        accountId: undefined,
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
        isSignedIn: false,
        isDaoRepresentative: false,
        isMetadataLoading: false,
        hasRegistrationSubmitted: false,
        hasRegistrationApproved: false,
        registrationStatus: undefined,
      };
    }
  }, [
    accountId,
    isDaoRepresentative,
    isRegistrationLoading,
    registration,
    wallet.isReady,
    wallet.isSignedIn,
  ]);
};
