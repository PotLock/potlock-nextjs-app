import { useCallback, useEffect, useMemo, useState } from "react";

import { List, indexer } from "@/common/api/indexer";
import { NOOP_STRING } from "@/common/constants";
import { useWalletUserSession } from "@/common/wallet";

import { ListOverviewType } from "../types";

type SetListTypeFn = (type: ListOverviewType) => void;
type SetRegistrationsFn = (lists: List[]) => void;

export const useAllLists = (
  setCurrentListType: SetListTypeFn,
  setFilteredRegistrations: SetRegistrationsFn,
  currentListType?: ListOverviewType,
) => {
  const viewer = useWalletUserSession();
  const [registrations, setRegistrations] = useState<List[]>([]);
  const [administratedListsOnly, setAdministratedListsOnly] = useState(false);

  const { data, isLoading } = indexer.useLists({
    page_size: 999,
  });

  const { data: myLists } = indexer.useLists({
    account: viewer.accountId,
    ...(administratedListsOnly && { admin: viewer.accountId }),
    page_size: 999,
  });

  const { data: myFavourites } = indexer.useAccountUpvotedLists({
    enabled: viewer.isSignedIn,
    accountId: viewer.accountId ?? NOOP_STRING,
  });

  const fetchAllLists = useCallback(() => {
    if (!data) return;

    setRegistrations(data.results);
    setFilteredRegistrations(data.results);
    setCurrentListType("ALL_LISTS");
  }, [data, setCurrentListType, setFilteredRegistrations]);

  const fetchMyLists = useCallback(() => {
    if (!viewer.isSignedIn || !myLists) return;

    setCurrentListType("MY_LISTS");
    setRegistrations(myLists.results);
    setFilteredRegistrations(myLists.results);
  }, [viewer.isSignedIn, myLists, setCurrentListType, setFilteredRegistrations]);

  const fetchFavourites = useCallback(() => {
    if (!viewer.isSignedIn || !myFavourites) return;

    setRegistrations(myFavourites);
    setFilteredRegistrations(myFavourites);
    setCurrentListType("MY_FAVORITES");
  }, [viewer.isSignedIn, myFavourites, setFilteredRegistrations, setCurrentListType]);

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
        condition: viewer.isSignedIn,
      },
      {
        label: "My Favorites",
        fetchFunction: fetchFavourites,
        type: "MY_FAVORITES",
        condition: viewer.isSignedIn,
      },
    ],
    [fetchAllLists, fetchMyLists, viewer.isSignedIn, fetchFavourites],
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
