import { createContext } from "react";

import { create } from "zustand";

import type { AccountId } from "@/common/types";

type WalletContextState =
  | { isReady: false; isSignedIn: false; accountId: undefined }
  | { isReady: true; isSignedIn: boolean; accountId?: AccountId };

const initialWalletContextState: WalletContextState = {
  isReady: false,
  isSignedIn: false,
  accountId: undefined,
};

export const WalletContext = createContext<WalletContextState>(initialWalletContextState);

type WalletContextStore = WalletContextState & {
  initialize: (isReady: boolean) => void;
  setIsSignedIn: (isSignedIn: boolean) => void;
  setAccountId: (accountId: AccountId | undefined) => void;
};

export const useWalletContextStore = create<WalletContextStore>((set) => ({
  ...initialWalletContextState,
  initialize: (isReady: boolean) => set(isReady ? { isReady } : initialWalletContextState),
  setIsSignedIn: (isSignedIn: boolean) => set({ isSignedIn }),
  setAccountId: (accountId: AccountId | undefined) => set({ accountId }),
}));
