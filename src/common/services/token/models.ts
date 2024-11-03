import { create } from "zustand";

import { AccountId } from "@/common/types";

type FtMetadataStoreState = {
  data?: AccountId[];
  error?: unknown;
};

interface FtMetadataStore extends FtMetadataStoreState {
  setData: (data: AccountId[]) => void;
  setError: (error: unknown) => void;
}

export const useFtMetadataStore = create<FtMetadataStore>()((set) => ({
  data: undefined,
  error: undefined,
  setData: (data: AccountId[]) => set({ data }),
  setError: (error: unknown) => set({ error }),
}));
