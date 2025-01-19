import { useMemo } from "react";

import { prop } from "remeda";

import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { useWalletManagerContext } from "@/common/contexts/wallet-manager";
import { RegistrationStatus, listsContractHooks } from "@/common/contracts/core/lists";
import { isAccountId } from "@/common/lib";
import { AccountId } from "@/common/types";
import { useGlobalStoreSelector } from "@/store";

import { Session } from "../types";

// TODO: Subscribe to wallet events to keep isSignedIn synced
export const useSession = (): Session => {
  const walletManagerContext = useWalletManagerContext();

  const isSignedIn = useMemo(
    () => (walletManagerContext.isReady ? walletManagerContext.walletSelector.isSignedIn() : false),
    [walletManagerContext],
  );

  const walletAccountId = useMemo(
    () => (walletManagerContext.isReady ? walletManagerContext.accountId : null),
    [walletManagerContext],
  );

  const { actAsDao, accountId: lastActiveAccountId } = useGlobalStoreSelector(prop("nav"));
  const asDao = actAsDao.toggle && Boolean(actAsDao.defaultAddress);

  const accountId: AccountId | undefined = useMemo(
    () => (asDao ? actAsDao.defaultAddress : (walletAccountId ?? lastActiveAccountId)),
    [actAsDao.defaultAddress, asDao, lastActiveAccountId, walletAccountId],
  );

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

  if (isSignedIn && accountId && isAccountIdValid) {
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
