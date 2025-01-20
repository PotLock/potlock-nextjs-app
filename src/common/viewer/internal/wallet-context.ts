import { createContext } from "react";

import type { AccountId } from "@/common/types";

type WalletContextState =
  | { isReady: false; isSignedIn: false; accountId: undefined }
  | { isReady: true; isSignedIn: boolean; accountId?: AccountId };

export const initialWalletContextState: WalletContextState = {
  isReady: false,
  isSignedIn: false,
  accountId: undefined,
};

export const WalletContext = createContext<WalletContextState>(initialWalletContextState);
