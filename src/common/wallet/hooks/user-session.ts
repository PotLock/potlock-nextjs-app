import { useMemo } from "react";

import { NOOP_STRING, PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { RegistrationStatus, listsContractHooks } from "@/common/contracts/core/lists";
import { sybilResistanceContractHooks } from "@/common/contracts/core/sybil-resistance";
import { isAccountId } from "@/common/lib";

import { useWalletUserAdapter } from "../adapters";
import { useWalletDaoAuthStore } from "../model/dao-auth";
import { type WalletUserSession, useWalletUserMetadataStore } from "../model/user-session";

export const useWalletUserSession = (): WalletUserSession => {
  const wallet = useWalletUserAdapter();
  const { referrerAccountId } = useWalletUserMetadataStore();
  const daoAuth = useWalletDaoAuthStore();

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
      };
    }
  }, [
    daoAuth.activeAccountId,
    daoAuth.isActive,
    isHuman,
    isMetadataLoading,
    referrerAccountId,
    registration,
    wallet.accountId,
    wallet.isReady,
    wallet.isSignedIn,
  ]);
};
