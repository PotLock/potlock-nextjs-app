import { create } from "zustand";

import { FungibleTokenMetadata, TokenId } from "@/common/types";

export type FtMetadataRegistry = Record<TokenId, FungibleTokenMetadata>;

type FtMetadataStoreState = {
  data?: FtMetadataRegistry;
  error?: unknown;
};

interface FtMetadataStore extends FtMetadataStoreState {
  setData: (data: FtMetadataRegistry) => void;
  setError: (error: unknown) => void;
}

export const useFtMetadataStore = create<FtMetadataStore>()((set) => ({
  data: undefined,
  error: undefined,
  setData: (data) => set({ data }),
  setError: (error: unknown) => set({ error }),
}));
