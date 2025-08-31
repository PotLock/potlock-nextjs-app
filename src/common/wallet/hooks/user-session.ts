import { useCallback, useMemo } from "react";

import { nearProtocolClient } from "@/common/blockchains/near-protocol";
import { NOOP_STRING, PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { RegistrationStatus, listsContractHooks } from "@/common/contracts/core/lists";
import { sybilResistanceContractHooks } from "@/common/contracts/core/sybil-resistance";
import { isAccountId } from "@/common/lib";

import { useWalletDaoStore } from "../model/dao";
import { type WalletUserSession, useWalletUserMetadataStore } from "../model/user-session";
import { useWalletUserAdapter } from "../user-adapter";

export const useWalletUserSession = (): WalletUserSession => {
  const wallet = useWalletUserAdapter();
  const { referrerAccountId } = useWalletUserMetadataStore();
  const daoAuth = useWalletDaoStore();

  console.log(daoAuth);

  const { isLoading: isHumanVerificationStatusLoading, data: isHuman } =
    sybilResistanceContractHooks.useIsHuman({
      enabled: wallet.isSignedIn,
      accountId: wallet.accountId ?? NOOP_STRING,
    });

  const { isLoading: isRegistrationLoading, data: registration } =
    listsContractHooks.useRegistration({
      enabled: wallet.isSignedIn,
      listId: PUBLIC_GOODS_REGISTRY_LIST_ID,
      accountId: (daoAuth.isActive ? daoAuth.activeAccountId : wallet.accountId) ?? NOOP_STRING,
    });

  const isMetadataLoading = isHumanVerificationStatusLoading || isRegistrationLoading;

  const logout = useCallback(() => {
    nearProtocolClient.walletApi.wallet?.signOut();
    wallet.reset();
    daoAuth.reset();
  }, [daoAuth, wallet]);

  return useMemo(() => {
    if (wallet.isReady && wallet.isSignedIn && wallet.accountId) {
      return {
        hasWalletReady: true,
        accountId: wallet.accountId,
        isSignedIn: true,

        ...(daoAuth.isActive
          ? {
              isDaoRepresentative: true,
              daoAccountId: daoAuth.activeAccountId,
            }
          : { isDaoRepresentative: false, daoAccountId: undefined }),

        isHuman: isHuman ?? false,
        isMetadataLoading,
        hasRegistrationSubmitted: registration !== undefined,
        hasRegistrationApproved: registration?.status === RegistrationStatus.Approved,
        registrationStatus: registration?.status,
        referrerAccountId: isAccountId(referrerAccountId) ? referrerAccountId : undefined,
        logout,
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
        referrerAccountId: undefined,
        logout,
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
        referrerAccountId: undefined,
        logout,
      };
    }
  }, [
    daoAuth.activeAccountId,
    daoAuth.isActive,
    isHuman,
    isMetadataLoading,
    logout,
    referrerAccountId,
    registration,
    wallet.accountId,
    wallet.isReady,
    wallet.isSignedIn,
  ]);
};
