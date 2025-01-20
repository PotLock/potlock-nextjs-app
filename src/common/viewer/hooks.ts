import { useContext, useMemo } from "react";

import { prop } from "remeda";

import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { RegistrationStatus, listsContractHooks } from "@/common/contracts/core/lists";
import { isAccountId } from "@/common/lib";
import { AccountId } from "@/common/types";
import { useGlobalStoreSelector } from "@/store";

import { WalletContext } from "./internal/wallet-context";
import { ViewerSession } from "./types";

/**
 * Heads Up!
 * Ensure the consuming layout is wrapped in `ViewerSessionProvider` on the topmost level.
 */
export const useViewerSession = (): ViewerSession => {
  const wallet = useContext(WalletContext);
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
