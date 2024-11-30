import { useCallback, useEffect, useState } from "react";

import { List, indexer } from "@/common/api/indexer";
import { walletApi } from "@/common/api/near";

export const useAllLists = (
  setCurrentListType: (type: string) => void,
  setFilteredRegistrations: (type: any) => void,
) => {
  const [registrations, setRegistrations] = useState<List[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const wallet = walletApi;

  const { data, isLoading } = indexer.useLists();
  const { data: myLists } = indexer.useLists({
    account: wallet?.accountId,
  });
  const { data: myFavourites } = indexer.useAccountUpvotedLists({
    accountId: wallet?.accountId as string,
  });

  const fetchAllLists = useCallback(async () => {
    setLoading(true);
    try {
      if (data) {
        setRegistrations(data.results);
        setFilteredRegistrations(data.results);
        setCurrentListType("All Lists");
      }
    } catch (error) {
      console.error("Error fetching all lists:", error);
    } finally {
      setLoading(false);
    }
  }, [data, setCurrentListType, setFilteredRegistrations]);

  const fetchMyLists = useCallback(async () => {
    if (!wallet?.accountId) return;
    setLoading(true);
    setCurrentListType("My Lists");
    try {
      if (myLists) {
        setRegistrations(myLists.results);
        setFilteredRegistrations(myLists.results);
      }
    } catch (error) {
      console.error("Error fetching my lists:", error);
    } finally {
      setLoading(false);
    }
  }, [wallet, myLists, setCurrentListType, setFilteredRegistrations]);

  const fetchFavourites = useCallback(async () => {
    if (!wallet?.accountId) return;
    setLoading(true);
    try {
      if (myFavourites) {
        setRegistrations(myFavourites);
        setFilteredRegistrations(myFavourites);
        setCurrentListType("My Favorites");
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  }, [wallet, myFavourites, setCurrentListType, setFilteredRegistrations]);

  useEffect(() => {
    if (!isLoading) {
      fetchAllLists();
    }
  }, [isLoading, fetchAllLists]);

  const buttons = [
    {
      label: "All Lists",
      fetchFunction: fetchAllLists,
      type: "All Lists",
    },
    {
      label: "My Lists",
      fetchFunction: fetchMyLists,
      type: "My Lists",
      condition: Boolean(walletApi?.accountId),
    },
    {
      label: "My Favorites",
      fetchFunction: fetchFavourites,
      type: "My Favorites",
      condition: Boolean(walletApi?.accountId),
    },
  ];

  return {
    registrations,
    buttons,
    loading,
    fetchAllLists,
    fetchMyLists,
    fetchFavourites,
  };
};
