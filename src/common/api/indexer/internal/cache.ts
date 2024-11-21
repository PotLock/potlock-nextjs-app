import { create } from "zustand";
import { persist } from "zustand/middleware";

import { ListId } from "@/common/types";

import { ListRegistration } from "./client.generated";

type ListRegistrationRegistryEntry = {
  totalCount: number;
  entries: ListRegistration[];
};

type ListRegistrationRegistry = Record<ListId, ListRegistrationRegistryEntry>;

type IndexerApiClientCacheStoreState = {
  listRegistrations: ListRegistrationRegistry;
};

type IndexerApiClientCacheStoreActions = {
  setListRegistrations: (
    listId: ListId,
    entries: ListRegistrationRegistryEntry,
  ) => void;
};

type IndexerApiClientStore = IndexerApiClientCacheStoreState &
  IndexerApiClientCacheStoreActions;

export const useIndexerApiClientCacheStore = create<IndexerApiClientStore>()(
  persist(
    (set, get) => {
      return {
        listRegistrations: [],

        setListRegistrations: (listId, entries) =>
          set({
            listRegistrations: {
              ...get().listRegistrations,
              [listId]: entries,
            },
          }),
      };
    },

    { name: "Indexer API client store" },
  ),
);
