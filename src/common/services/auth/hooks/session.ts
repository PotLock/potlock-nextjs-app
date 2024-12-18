import { useMemo } from "react";

import { prop } from "remeda";

import { ListRegistrationStatus, indexer } from "@/common/api/indexer";
import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { AccountId } from "@/common/types";
import { useGlobalStoreSelector } from "@/store";

import { useWallet } from "./wallet";
import { AuthSession } from "../types";

export const useSessionAuth = (): AuthSession => {
  const { isSignedIn, wallet } = useWallet();
  const { actAsDao, accountId: lastActiveAccountId } = useGlobalStoreSelector(prop("nav"));
  const asDao = actAsDao.toggle && Boolean(actAsDao.defaultAddress);

  const accountId: AccountId | undefined = useMemo(
    () => (asDao ? actAsDao.defaultAddress : (wallet?.accountId ?? lastActiveAccountId)),
    [actAsDao.defaultAddress, asDao, lastActiveAccountId, wallet?.accountId],
  );

  const { isLoading: isAccountListRegistryLoading, data: accountListRegistrations } =
    indexer.useAccountListRegistrations({
      accountId,
      page_size: 9999,
    });

  const { registrant: publicGoodsRegistryAccount, status } = useMemo(
    () =>
      accountListRegistrations?.results?.find(
        ({ list }) => list.id === PUBLIC_GOODS_REGISTRY_LIST_ID,
      ) ?? { registrant: undefined, status: undefined },

    [accountListRegistrations?.results],
  );

  if (isSignedIn && accountId) {
    return {
      accountId,
      account: publicGoodsRegistryAccount,
      isSignedIn: true,
      isAccountInfoLoading: isAccountListRegistryLoading,
      isVerifiedPublicGoodsProvider: status === ListRegistrationStatus.Approved,
    };
  } else {
    return {
      accountId: undefined,
      account: undefined,
      isSignedIn: false,
      isAccountInfoLoading: false,
      isVerifiedPublicGoodsProvider: false,
    };
  }
};

export const useUserSession = useSessionAuth;
