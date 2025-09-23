import { useCallback, useMemo } from "react";

import { nearProtocolClient } from "@/common/blockchains/near-protocol";
import { NOOP_STRING, PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { RegistrationStatus, listsContractHooks } from "@/common/contracts/core/lists";
import { sybilResistanceContractHooks } from "@/common/contracts/core/sybil-resistance";
import { isAccountId } from "@/common/lib";

import { useWalletDaoStore } from "../model/dao";
import { type WalletUserSession, useWalletUserMetadataStore } from "../model/user";
import { useWalletUserAdapter } from "../user-adapter";

export const useWalletUserSession = (): WalletUserSession => {
  const wallet = useWalletUserAdapter();
  const { referrerAccountId } = useWalletUserMetadataStore();
  const daoAuth = useWalletDaoStore();

  const activeAccountId = useMemo(
    () => (daoAuth.isActive ? daoAuth.activeAccountId : wallet.accountId),
    [daoAuth.activeAccountId, daoAuth.isActive, wallet.accountId],
  );

  const { isLoading: isHumanVerificationStatusLoading, data: isHuman } =
    sybilResistanceContractHooks.useIsHuman({
      enabled: activeAccountId !== undefined,
      accountId: activeAccountId ?? NOOP_STRING,
    });

  const { isLoading: isRegistrationLoading, data: registration } =
    listsContractHooks.useRegistration({
      enabled: activeAccountId !== undefined,
      accountId: activeAccountId ?? NOOP_STRING,
      listId: PUBLIC_GOODS_REGISTRY_LIST_ID,
    });

  const isMetadataLoading = isHumanVerificationStatusLoading || isRegistrationLoading;

  const logout = useCallback(() => {
    nearProtocolClient.walletApi.wallet?.signOut();
    wallet.reset();
    daoAuth.reset();
  }, [daoAuth, wallet]);

  return useMemo(() => {
    if (wallet.isReady && wallet.isSignedIn && wallet.accountId && activeAccountId !== undefined) {
      return {
        hasWalletReady: true,
        isSignedIn: true,
        isDaoRepresentative: daoAuth.isActive,
        isHuman: isHuman ?? false,
        isMetadataLoading,
        hasRegistrationSubmitted: registration !== undefined,
        hasRegistrationApproved: registration?.status === RegistrationStatus.Approved,
        signerAccountId: wallet.accountId,
        accountId: activeAccountId,
        registrationStatus: registration?.status,
        referrerAccountId: isAccountId(referrerAccountId) ? referrerAccountId : undefined,
        logout,
      };
    } else if (wallet.isReady && !wallet.isSignedIn) {
      return {
        hasWalletReady: true,
        isSignedIn: false,
        isDaoRepresentative: false,
        isHuman: false,
        isMetadataLoading: false,
        hasRegistrationSubmitted: false,
        hasRegistrationApproved: false,
        signerAccountId: undefined,
        accountId: undefined,
        registrationStatus: undefined,
        referrerAccountId: undefined,
        logout,
      };
    } else {
      return {
        hasWalletReady: false,
        isSignedIn: false,
        isDaoRepresentative: false,
        isHuman: false,
        isMetadataLoading: false,
        hasRegistrationSubmitted: false,
        hasRegistrationApproved: false,
        signerAccountId: undefined,
        accountId: undefined,
        registrationStatus: undefined,
        referrerAccountId: undefined,
        logout,
      };
    }
  }, [
    activeAccountId,
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
