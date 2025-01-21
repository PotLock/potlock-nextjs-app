import { create } from "zustand";

import type { AccountId } from "@/common/types";

type WalletAccountState = {
  accountId: AccountId | undefined;
  isSignedIn: boolean;
};

type WalletContextState = { error: null | unknown } & (
  | { isReady: false; isSignedIn: false; accountId: undefined }
  | ({ isReady: true } & WalletAccountState)
);

const initialWalletContextState: WalletContextState = {
  isReady: false,
  isSignedIn: false,
  accountId: undefined,
  error: null,
};

type WalletContextStore = WalletContextState & {
  registerInit: (isReady: boolean) => void;
  setAccountState: (state: WalletAccountState) => void;
  setError: (error: unknown) => void;
};

export const useWalletContextStore = create<WalletContextStore>((set) => ({
  ...initialWalletContextState,
  registerInit: (isReady: boolean) => set(isReady ? { isReady } : initialWalletContextState),
  setAccountState: (newAccountState: WalletAccountState) => set(newAccountState),
  setError: (error: unknown) => set({ error }),
}));
