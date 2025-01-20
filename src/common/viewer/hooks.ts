import { useMemo } from "react";

import { prop } from "remeda";

import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { useWalletContext } from "@/common/contexts/wallet";
import { RegistrationStatus, listsContractHooks } from "@/common/contracts/core/lists";
import { isAccountId } from "@/common/lib";
import { AccountId } from "@/common/types";
import { useGlobalStoreSelector } from "@/store";

import { ViewerSession } from "./types";

export const useViewerSession = (): ViewerSession => {
  const wallet = useWalletContext();
  const { actAsDao } = useGlobalStoreSelector(prop("nav"));
  const isDaoRepresentative = actAsDao.toggle && Boolean(actAsDao.defaultAddress);

  const accountId: AccountId | undefined = useMemo(() => {
    if (wallet.isReady) {
      return isDaoRepresentative ? actAsDao.defaultAddress : wallet.accountId;
    } else return undefined;
  }, [actAsDao.defaultAddress, isDaoRepresentative, wallet.accountId, wallet.isReady]);

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

  if (wallet.isSignedIn && accountId && isAccountIdValid) {
    return {
      accountId,
      isSignedIn: true,
      isMetadataLoading: isRegistrationLoading,
      hasRegistrationSubmitted: registration !== undefined,
      hasRegistrationApproved: registration?.status === RegistrationStatus.Approved,
      registrationStatus: registration?.status,
    };
  } else {
    return {
      accountId: undefined,
      isSignedIn: false,
      isMetadataLoading: false,
      hasRegistrationSubmitted: false,
      hasRegistrationApproved: false,
      registrationStatus: undefined,
    };
  }
};
