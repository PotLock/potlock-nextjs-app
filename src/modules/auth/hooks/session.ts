import { useMemo } from "react";

import { prop } from "remeda";

import { indexer } from "@/common/api/indexer";
import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { AccountId } from "@/common/types";
import { useGlobalStoreSelector } from "@/store";

import { useWallet } from "./wallet";
import { AuthSession } from "../types";

export const useAuthSession = (): AuthSession => {
  const { isSignedIn, wallet } = useWallet();
  const { actAsDao } = useGlobalStoreSelector(prop("nav"));
  const asDao = actAsDao.toggle && Boolean(actAsDao.defaultAddress);

  const { data } = indexer.useListRegistrations({
    listId: PUBLIC_GOODS_REGISTRY_LIST_ID,
    page_size: 9999,
  });

  const accountId: AccountId | undefined = useMemo(
    () => (asDao ? actAsDao.defaultAddress : wallet?.accountId),

    [actAsDao.defaultAddress, asDao, wallet?.accountId],
  );

  const account = useMemo(
    () => data?.results?.find(({ registrant }) => registrant.id === accountId)?.registrant,

    [accountId, data?.results],
  );

  return { isSignedIn, accountId, account };
};
