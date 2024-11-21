import { create } from "zustand";
import { persist } from "zustand/middleware";

import { ListId } from "@/common/types";

import { ListRegistration } from "./client.generated";

type ListProjectRegistry = Record<ListRegistration["id"], ListRegistration>;

export type ListRegistryEntry = {
  registrations: ListProjectRegistry;
  totalRegistrationCount: number;
};

type ListRegistry = Record<ListId, ListRegistryEntry>;

type IndexerApiClientCacheStoreState = {
  lists: ListRegistry;
};

type IndexerApiClientCacheStoreActions = {
  setListData: (
    listId: ListId,
    data: { registrations: ListRegistration[]; totalRegistrationCount: number },
  ) => void;
};

type IndexerApiClientStore = IndexerApiClientCacheStoreState &
  IndexerApiClientCacheStoreActions;

export const useIndexerApiClientCacheStore = create<IndexerApiClientStore>()(
  persist(
    (set, get) => {
      return {
        lists: {},

        setListData: (listId, { totalRegistrationCount, registrations }) => {
          const { lists } = get();

          set({
            lists: {
              ...lists,

              [listId]: {
                ...lists[listId],
                totalRegistrationCount,

                registrations: registrations.reduce(
                  (registrationsById, registration) => ({
                    ...registrationsById,
                    [registration.id]: registration,
                  }),

                  {},
                ),
              },
            },
          });
        },
      };
    },

    { name: "Indexer API client cache" },
  ),
);
