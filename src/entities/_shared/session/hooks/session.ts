import { useMemo } from "react";

import { prop } from "remeda";

import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { RegistrationStatus, listsContractHooks } from "@/common/contracts/core/lists";
import { isAccountId } from "@/common/lib";
import { AccountId } from "@/common/types";
import { useGlobalStoreSelector } from "@/store";

import { useWallet } from "./wallet";
import { UserSession } from "../types";

export const useSession = (): UserSession => {
  const { isSignedIn, wallet } = useWallet();
  const { actAsDao, accountId: lastActiveAccountId } = useGlobalStoreSelector(prop("nav"));
  const isDaoRepresentative = actAsDao.toggle && Boolean(actAsDao.defaultAddress);

  const accountId: AccountId | undefined = useMemo(
    () =>
      isDaoRepresentative ? actAsDao.defaultAddress : (wallet?.accountId ?? lastActiveAccountId),

    [actAsDao.defaultAddress, isDaoRepresentative, lastActiveAccountId, wallet?.accountId],
  );

  /**
   * Account for edge cases in which the wallet is connected to a mismatching network
   *  ( e.g. testnet account in mainnet-bound environments )
   */
  const isAccountIdValid = useMemo(() => isAccountId(accountId), [accountId]);

  const { isLoading: isRegistrationFlagLoading, data: isRegistered = false } =
    listsContractHooks.useIsRegistered({
      enabled: isAccountIdValid,
      accountId: accountId ?? "noop",
      listId: PUBLIC_GOODS_REGISTRY_LIST_ID,
    });

  const { isLoading: isRegistrationLoading, data: registration } =
    listsContractHooks.useRegistration({
      enabled: isRegistered,
      accountId: accountId ?? "noop",
      listId: PUBLIC_GOODS_REGISTRY_LIST_ID,
    });

  if (isSignedIn && accountId && isAccountIdValid) {
    return {
      accountId,
      isSignedIn: true,
      isDaoRepresentative,
      isMetadataLoading: isRegistrationFlagLoading || isRegistrationLoading,
      hasRegistrationApproved: registration?.status === RegistrationStatus.Approved,
      registrationStatus: registration?.status,
    };
  } else {
    return {
      accountId: undefined,
      registrationStatus: undefined,
      isSignedIn: false,
      isDaoRepresentative: false,
      isMetadataLoading: false,
      hasRegistrationApproved: false,
    };
  }
};
