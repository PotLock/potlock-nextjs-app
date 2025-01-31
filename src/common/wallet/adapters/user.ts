import { create } from "zustand";

import type { AccountId } from "@/common/types";

type WalletAccountState = {
  accountId: AccountId | undefined;
  isSignedIn: boolean;
};

type WalletUserAdapterContextState = { error: null | unknown } & (
  | { isReady: false; isSignedIn: false; accountId: undefined }
  | ({ isReady: true } & WalletAccountState)
);

const initialWalletUserAdapterContextState: WalletUserAdapterContextState = {
  isReady: false,
  isSignedIn: false,
  accountId: undefined,
  error: null,
};

type WalletUserAdapterContextStore = WalletUserAdapterContextState & {
  registerInit: (isReady: boolean) => void;
  setAccountState: (state: WalletAccountState) => void;
  setError: (error: unknown) => void;
};

export const useWalletUserAdapterContext = create<WalletUserAdapterContextStore>((set) => ({
  ...initialWalletUserAdapterContextState,

  registerInit: (isReady: boolean) =>
    set(isReady ? { isReady } : initialWalletUserAdapterContextState),

  setAccountState: (newAccountState: WalletAccountState) => set(newAccountState),
  setError: (error: unknown) => set({ error }),
}));
