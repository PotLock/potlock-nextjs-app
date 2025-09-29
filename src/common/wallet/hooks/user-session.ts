import { useCallback, useMemo } from "react";

import { indexer } from "@/common/api/indexer";
import { nearProtocolClient } from "@/common/blockchains/near-protocol";
import { NOOP_FUNCTION, NOOP_STRING, PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { RegistrationStatus, listsContractHooks } from "@/common/contracts/core/lists";
import { sybilResistanceContractHooks } from "@/common/contracts/core/sybil-resistance";
import { isAccountId } from "@/common/lib";
import type { AccountId } from "@/common/types";

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

  const validReferrerAccountId: AccountId | undefined = useMemo(
    () => (isAccountId(referrerAccountId) ? referrerAccountId : undefined),
    [referrerAccountId],
  );

  const { isLoading: isHumanVerificationStatusLoading, data: isHuman } =
    sybilResistanceContractHooks.useIsHuman({
      enabled: activeAccountId !== undefined,
      accountId: activeAccountId ?? NOOP_STRING,
    });

  const {
    isLoading: isIndexedListRegistrationDataLoading,
    data: indexedListRegistrations,
    error: indexedListRegistrationsError,
    mutate: refetchIndexedListRegistrations,
  } = indexer.useAccountListRegistrations({
    enabled: activeAccountId !== undefined,
    accountId: activeAccountId ?? NOOP_STRING,
  });

  const indexedRegistration = useMemo(
    () =>
      indexedListRegistrations?.results.find(
        ({ list_id }) => list_id === PUBLIC_GOODS_REGISTRY_LIST_ID,
      ),

    [indexedListRegistrations],
  );

  const {
    isLoading: isRegistrationLoading,
    data: registration,
    mutate: refetchRegistrationData,
  } = listsContractHooks.useRegistration({
    enabled: activeAccountId !== undefined && indexedListRegistrationsError !== undefined,
    accountId: activeAccountId ?? NOOP_STRING,
    listId: PUBLIC_GOODS_REGISTRY_LIST_ID,
  });

  const isMetadataLoading =
    (isHuman === undefined && isHumanVerificationStatusLoading) ||
    (indexedListRegistrations === undefined && isIndexedListRegistrationDataLoading) ||
    (registration === undefined && isRegistrationLoading);

  const hasRegistrationSubmitted = useMemo(
    () => indexedRegistration !== undefined || registration !== undefined,
    [indexedRegistration, registration],
  );

  const registrationStatus: RegistrationStatus | undefined = useMemo(() => {
    const availableStatus = indexedRegistration?.status ?? registration?.status;

    return availableStatus !== undefined ? RegistrationStatus[availableStatus] : undefined;
  }, [indexedRegistration?.status, registration?.status]);

  const hasRegistrationApproved = useMemo(
    () => registrationStatus === RegistrationStatus.Approved,
    [registrationStatus],
  );

  const refetchRegistrationStatus = useCallback(() => {
    if (indexedListRegistrationsError === undefined) {
      refetchIndexedListRegistrations();
    } else refetchRegistrationData();
  }, [indexedListRegistrationsError, refetchIndexedListRegistrations, refetchRegistrationData]);

  const logout = useCallback(() => {
    nearProtocolClient.walletApi.wallet
      ?.signOut()
      .then(() => {
        wallet.reset();
        daoAuth.reset();
      })
      .catch(NOOP_FUNCTION);
  }, [daoAuth, wallet]);

  if (wallet.isReady && wallet.isSignedIn && wallet.accountId && activeAccountId !== undefined) {
    return {
      hasWalletReady: true,
      isSignedIn: true,
      isDaoRepresentative: daoAuth.isActive,
      isHuman: isHuman ?? false,
      isMetadataLoading,
      hasRegistrationSubmitted,
      hasRegistrationApproved,
      signerAccountId: wallet.accountId,
      accountId: activeAccountId,
      registrationStatus,
      referrerAccountId: validReferrerAccountId,
      refetchRegistrationStatus,
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
      refetchRegistrationStatus: undefined,
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
      refetchRegistrationStatus: undefined,
      logout,
    };
  }
};
