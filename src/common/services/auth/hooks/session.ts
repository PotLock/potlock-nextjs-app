import { useMemo } from "react";

import { prop } from "remeda";

import { ListRegistrationStatus, indexer } from "@/common/api/indexer";
import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { isAccountId } from "@/common/lib";
import { AccountId } from "@/common/types";
import { useGlobalStoreSelector } from "@/store";

import { useWallet } from "./wallet";
import { UserSession } from "../types";

export const useUserSession = (): UserSession => {
  const { isSignedIn, wallet } = useWallet();
  const { actAsDao, accountId: lastActiveAccountId } = useGlobalStoreSelector(prop("nav"));
  const asDao = actAsDao.toggle && Boolean(actAsDao.defaultAddress);

  const accountId: AccountId | undefined = useMemo(
    () => (asDao ? actAsDao.defaultAddress : (wallet?.accountId ?? lastActiveAccountId)),
    [actAsDao.defaultAddress, asDao, lastActiveAccountId, wallet?.accountId],
  );

  /**
   * Account for edge cases in which the wallet is connected to a mismatching network
   *  ( e.g. testnet account in mainnet-bound environments )
   */
  const isAccountIdValid = useMemo(() => isAccountId(accountId), [accountId]);

  const { isLoading: isAccountListRegistryLoading, data: accountListRegistrations } =
    indexer.useAccountListRegistrations({
      accountId: isAccountIdValid ? accountId : undefined,
      page_size: 9999,
    });

  const { registrant: publicGoodsRegistryAccount, status: registrationStatus } = useMemo(
    () =>
      accountListRegistrations?.results?.find(
        ({ list }) => list.id === PUBLIC_GOODS_REGISTRY_LIST_ID,
      ) ?? { registrant: undefined, status: undefined },

    [accountListRegistrations?.results],
  );

  if (isSignedIn && accountId && isAccountIdValid) {
    return {
      accountId,
      account: publicGoodsRegistryAccount,
      registrationStatus,
      isSignedIn: true,
      isAccountInfoLoading: isAccountListRegistryLoading,
      isVerifiedPublicGoodsProvider: registrationStatus === ListRegistrationStatus.Approved,
    };
  } else {
    return {
      accountId: undefined,
      account: undefined,
      registrationStatus: undefined,
      isSignedIn: false,
      isAccountInfoLoading: false,
      isVerifiedPublicGoodsProvider: false,
    };
  }
};
