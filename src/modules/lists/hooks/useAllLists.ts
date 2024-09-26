import { useCallback, useState } from "react";

import { walletApi } from "@/common/api/near";
import {
  getLists,
  get_list_for_owner,
  get_upvoted_lists_for_account,
} from "@/common/contracts/potlock/lists"; // Adjust the import based on your project structure

export const useAllLists = (
  setCurrentListType: (type: string) => void,
  setFilteredRegistrations: (type: any) => void,
) => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const wallet = walletApi;

  const fetchAllLists = useCallback(async () => {
    setLoading(true);
    try {
      const allLists: any = await getLists();
      setRegistrations(allLists);
      setFilteredRegistrations(allLists);
      setCurrentListType("All Lists");
    } catch (error) {
      console.error("Error fetching all lists:", error);
    } finally {
      setLoading(false);
    }
  }, [setCurrentListType]);

  const fetchMyLists = useCallback(async () => {
    setCurrentListType("My Lists");
    if (!wallet?.accountId) return; // Ensure accountId is available
    try {
      const myLists: any = await get_list_for_owner({
        owner_id: wallet.accountId,
      });
      setRegistrations(myLists);
      setFilteredRegistrations(myLists);
    } catch (error) {
      console.error("Error fetching my lists:", error);
    }
  }, [wallet, setCurrentListType]);

  const fetchFavourites = useCallback(async () => {
    if (!wallet?.accountId) return; // Ensure accountId is available
    try {
      const upvotedLists: any = await get_upvoted_lists_for_account({
        account_id: wallet.accountId,
      });
      setRegistrations(upvotedLists);
      setFilteredRegistrations(upvotedLists);
      setCurrentListType("My Favorites");
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  }, [wallet, setCurrentListType]);

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
