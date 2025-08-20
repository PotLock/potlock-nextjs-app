import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AccountId } from "@/common/types";

import { validateUserInDao } from "../utils/validation";

type WalletDaoAuth = { listedAccountIds: AccountId[] } & (
  | {
      isActive: false;
      activeAccountId: null;
      error: Error | null;
    }
  | {
      isActive: true;
      activeAccountId: AccountId;
      error: null;
    }
);

type WalletDaoAuthState = WalletDaoAuth & {
  reset: () => void;
  listDao: (accountId: AccountId) => void;
  delistDao: (accountId: AccountId) => void;
  tryActivate: (params: { accountIdIndex: number; onError: (err: Error) => void }) => void;
  deactivate: VoidFunction;
};

const initialState: WalletDaoAuth = {
  listedAccountIds: [],
  isActive: false,
  activeAccountId: null,
  error: null,
};

export const useWalletDaoAuthStore = create<WalletDaoAuthState>()(
  persist(
    (set, get) => ({
      ...initialState,
      reset: () => set(initialState),

      listDao: (accountId: AccountId) => {
        const listedAccountIds = get().listedAccountIds;

        if (!listedAccountIds.includes(accountId)) {
          set({ listedAccountIds: [...listedAccountIds, accountId] });
        }
      },

      delistDao: (accountId: AccountId) => {
        const listedAccountIds = get().listedAccountIds;

        if (listedAccountIds.includes(accountId)) {
          set({ listedAccountIds: listedAccountIds.filter((id) => id !== accountId) });
        }
      },

      tryActivate: ({ accountIdIndex, onError }) => {
        const daoAccountId = get().listedAccountIds.at(accountIdIndex);

        // TODO: Permission check
        const valid = daoAccountId !== undefined && false;

        if (valid) {
          set({
            isActive: true,
            activeAccountId: daoAccountId,
            error: null,
          });
        } else {
          const error = new Error(
            daoAccountId === undefined
              ? "The account ID is not listed."
              : "Insufficient DAO permissions.",
          );

          set({ isActive: false, activeAccountId: null, error });
          onError(error);
        }
      },

      deactivate: () => set({ isActive: false, activeAccountId: null, error: null }),
    }),

    { name: "wallet-dao-auth" },
  ),
);
