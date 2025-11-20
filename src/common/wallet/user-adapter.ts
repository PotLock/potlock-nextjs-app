import { create } from "zustand";

import type { AccountId } from "@/common/types";

type WalletUserAccountState = {
  accountId: AccountId | undefined;
  isSignedIn: boolean;
};

type WalletUserAdapterState = { error: null | unknown } & (
  | { isReady: false; isSignedIn: false; accountId: undefined }
  | ({ isReady: true } & WalletUserAccountState)
);

const initialWalletUserAdapterState: WalletUserAdapterState = {
  isReady: false,
  isSignedIn: false,
  accountId: undefined,
  error: null,
};

type WalletUserAdapterStore = WalletUserAdapterState & {
  reset: () => void;
  registerInit: (isReady: boolean) => void;
  setAccountState: (state: WalletUserAccountState) => void;
  setError: (error: unknown) => void;
};

export const useWalletUserAdapter = create<WalletUserAdapterStore>((set) => ({
  ...initialWalletUserAdapterState,
  reset: () => set(initialWalletUserAdapterState),
  registerInit: (isReady: boolean) => set(isReady ? { isReady } : initialWalletUserAdapterState),
  setAccountState: (newAccountState: WalletUserAccountState) => set(newAccountState),
  setError: (error: unknown) => set({ error }),
}));
