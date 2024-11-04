import { create } from "zustand";
import { persist } from "zustand/middleware";

import { FungibleTokenMetadata, TokenId } from "@/common/types";

export type FtRegistryEntry = {
  contract_account_id: TokenId;
  metadata: FungibleTokenMetadata;
  balance?: string;
};

export type FtRegistry = Record<TokenId, FtRegistryEntry>;

type FtRegistryStoreState = {
  data?: FtRegistry;
  error?: unknown;
};

interface FtRegistryStore extends FtRegistryStoreState {
  setData: (data: FtRegistry) => void;
  setError: (error: unknown) => void;
}

export const useFtRegistryStore = create<FtRegistryStore>()(
  persist(
    (set) => ({
      data: undefined,
      error: undefined,
      setData: (data) => set({ data }),
      setError: (error: unknown) => set({ error }),
    }),

    { name: "FT Registry" },
  ),
);
