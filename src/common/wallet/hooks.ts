import { useMemo } from "react";

import { prop } from "remeda";

import { NOOP_STRING, PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { RegistrationStatus, listsContractHooks } from "@/common/contracts/core/lists";
import { sybilResistanceContractHooks } from "@/common/contracts/core/sybil-resistance";
import { isAccountId } from "@/common/lib";
import { useGlobalStoreSelector } from "@/store";

import { useWalletUserAdapter } from "./adapters";
import { type WalletUserSession, useWalletUserMetadataStore } from "./model/user-session";

export const useWalletUserSession = (): WalletUserSession => {
  const wallet = useWalletUserAdapter();
  const { referrerAccountId } = useWalletUserMetadataStore();
  const { actAsDao } = useGlobalStoreSelector(prop("nav"));
  const daoAccountId = actAsDao.defaultAddress;
  const isDaoAccountIdValid = useMemo(() => isAccountId(daoAccountId), [daoAccountId]);
  const isDaoRepresentative = actAsDao.toggle && isDaoAccountIdValid;

  // TODO: Check DAO member permissions?
  const canSubmitDaoProposals = useMemo(() => {
    return false;
  }, []);

  const { isLoading: isHumanVerificationStatusLoading, data: isHuman } =
    sybilResistanceContractHooks.useIsHuman({
      enabled: wallet.isSignedIn,
      accountId: wallet.accountId ?? NOOP_STRING,
    });

  const { isLoading: isRegistrationLoading, data: registration } =
    listsContractHooks.useRegistration({
      enabled: wallet.isSignedIn,
      listId: PUBLIC_GOODS_REGISTRY_LIST_ID,
      accountId: (isDaoRepresentative ? daoAccountId : wallet.accountId) ?? NOOP_STRING,
    });

  const isMetadataLoading = isHumanVerificationStatusLoading || isRegistrationLoading;

  return useMemo(() => {
    if (wallet.isReady && wallet.isSignedIn && wallet.accountId) {
      return {
        hasWalletReady: true,
        accountId: wallet.accountId,
        isSignedIn: true,

        ...(isDaoRepresentative
          ? { isDaoRepresentative, daoAccountId, canSubmitDaoProposals }
          : { isDaoRepresentative: false, daoAccountId: undefined, canSubmitDaoProposals: false }),

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
        canSubmitDaoProposals: false,
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
        canSubmitDaoProposals: false,
        hasRegistrationSubmitted: false,
        hasRegistrationApproved: false,
        registrationStatus: undefined,
        referrerAccountId: undefined,
      };
    }
  }, [
    canSubmitDaoProposals,
    daoAccountId,
    isDaoRepresentative,
    isHuman,
    isMetadataLoading,
    referrerAccountId,
    registration,
    wallet.accountId,
    wallet.isReady,
    wallet.isSignedIn,
  ]);
};
