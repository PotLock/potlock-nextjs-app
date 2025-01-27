import { useCallback, useEffect, useMemo, useState } from "react";

import { List, indexer } from "@/common/api/indexer";
import { walletApi } from "@/common/api/near-protocol/client";

import { ListOverviewType } from "../types";

type SetListTypeFn = (type: ListOverviewType) => void;
type SetRegistrationsFn = (lists: List[]) => void;

export const useAllLists = (
  setCurrentListType: SetListTypeFn,
  setFilteredRegistrations: SetRegistrationsFn,
  currentListType?: ListOverviewType,
) => {
  const [registrations, setRegistrations] = useState<List[]>([]);
  const [administratedListsOnly, setAdministratedListsOnly] = useState(false);
  const wallet = walletApi;

  const { data, isLoading } = indexer.useLists({
    page_size: 999,
  });

  const { data: myLists } = indexer.useLists({
    account: wallet?.accountId,
    ...(administratedListsOnly && { admin: wallet?.accountId }),
    page_size: 999,
  });

  const { data: myFavourites } = indexer.useAccountUpvotedLists({
    accountId: wallet?.accountId as string,
  });

  const fetchAllLists = useCallback(() => {
    if (!data) return;

    setRegistrations(data.results);
    setFilteredRegistrations(data.results);
    setCurrentListType("ALL_LISTS");
  }, [data, setCurrentListType, setFilteredRegistrations]);

  const fetchMyLists = useCallback(() => {
    if (!wallet?.accountId || !myLists) return;

    setCurrentListType("MY_LISTS");
    setRegistrations(myLists.results);
    setFilteredRegistrations(myLists.results);
  }, [wallet?.accountId, myLists, setCurrentListType, setFilteredRegistrations]);

  const fetchFavourites = useCallback(() => {
    if (!wallet?.accountId || !myFavourites) return;

    setRegistrations(myFavourites);
    setFilteredRegistrations(myFavourites);
    setCurrentListType("MY_FAVORITES");
  }, [wallet?.accountId, myFavourites, setCurrentListType, setFilteredRegistrations]);

  const actions = useMemo(
    () => [
      {
        label: "All Lists",
        fetchFunction: fetchAllLists,
        type: "ALL_LISTS",
      },
      {
        label: "My Lists",
        fetchFunction: fetchMyLists,
        type: "MY_LISTS",
        condition: Boolean(wallet?.accountId),
      },
      {
        label: "My Favorites",
        fetchFunction: fetchFavourites,
        type: "MY_FAVORITES",
        condition: Boolean(wallet?.accountId),
      },
    ],
    [fetchAllLists, fetchMyLists, fetchFavourites, wallet?.accountId],
  );

  useEffect(() => {
    if (currentListType === "MY_LISTS") {
      fetchMyLists();
    }
  }, [administratedListsOnly, fetchMyLists, currentListType]);

  useEffect(() => {
    if (!isLoading) {
      fetchAllLists();
    }
  }, [isLoading, fetchAllLists]);

  return {
    registrations,
    buttons: actions,
    loading: isLoading,
    administratedListsOnly,
    setAdministratedListsOnly,
    fetchAllLists,
    fetchMyLists,
    fetchFavourites,
  };
};
