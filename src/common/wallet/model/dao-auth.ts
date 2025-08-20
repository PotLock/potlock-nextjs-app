import { create } from "zustand";
import { persist } from "zustand/middleware";

import { sputnikDaoQueries } from "@/common/contracts/sputnikdao2";
import type { AccountId } from "@/common/types";

type WalletDaoAuth = { listedAccountIds: AccountId[] } & (
  | {
      isActive: false;
      activeAccountId: null;
    }
  | {
      isActive: true;
      activeAccountId: AccountId;
    }
);

type TryActivateParams = {
  userAccountId: AccountId;
  listingIndex: number;
  onError: (err: Error) => void;
};

type WalletDaoAuthState = WalletDaoAuth & {
  reset: () => void;
  listDao: (accountId: AccountId) => void;
  delistDao: (accountId: AccountId) => void;
  tryActivate: (params: TryActivateParams) => void;
  deactivate: VoidFunction;
};

const initialState: WalletDaoAuth = {
  listedAccountIds: [],
  isActive: false,
  activeAccountId: null,
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

      tryActivate: ({ userAccountId, listingIndex, onError }) => {
        const daoAccountId = get().listedAccountIds.at(listingIndex);

        if (daoAccountId === undefined) {
          onError(new Error("The account ID is not listed."));
        } else {
          sputnikDaoQueries
            .getPermissions({ daoAccountId, accountId: userAccountId })
            .then(({ canSubmitProposals }) => {
              if (canSubmitProposals) {
                set({ isActive: true, activeAccountId: daoAccountId });
              } else {
                onError(new Error("Insufficient DAO permissions."));
              }
            })
            .catch((err) => {
              console.error(err);
              onError(new Error("Unable to check your DAO permissions."));
            });
        }
      },

      deactivate: () => set({ isActive: false, activeAccountId: null }),
    }),

    { name: "wallet-dao-auth" },
  ),
);
