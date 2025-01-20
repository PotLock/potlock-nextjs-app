import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { nearClient } from "@/common/api/near";

import type { AccountId } from "../types";

type WalletContextState =
  | { isReady: false; isSignedIn: false; accountId: undefined }
  | { isReady: true; isSignedIn: boolean; accountId?: AccountId };

const initialWalletContextState: WalletContextState = {
  isReady: false,
  isSignedIn: false,
  accountId: undefined,
};

const WalletContext = createContext<WalletContextState>(initialWalletContextState);

export type WalletProviderProps = {
  children: React.ReactNode;
};

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accountId, setAccountId] = useState<AccountId | undefined>(undefined);

  const syncWalletState = useCallback(() => {
    setIsSignedIn(nearClient.walletApi.walletSelector.isSignedIn());
    setAccountId(nearClient.walletApi.accountId);
  }, []);

  useEffect(() => {
    if (!isReady && error !== null) {
      nearClient.walletApi
        .initNear()
        .then(() => setIsReady(true))
        .catch((error) => {
          console.log(error);
          setError(error);
          setIsReady(false);
        });
    }
  }, [error, isReady]);

  useEffect(() => {
    if (isReady) {
      nearClient.walletApi.walletSelector.on("signedIn", syncWalletState);
      nearClient.walletApi.walletSelector.on("signedOut", syncWalletState);
      nearClient.walletApi.walletSelector.on("accountsChanged", syncWalletState);
      nearClient.walletApi.walletSelector.on("networkChanged", syncWalletState);
      nearClient.walletApi.walletSelector.on("uriChanged", syncWalletState);
    }

    return () => {
      if (isReady) {
        nearClient.walletApi.walletSelector.off("signedIn", syncWalletState);
        nearClient.walletApi.walletSelector.off("signedOut", syncWalletState);
        nearClient.walletApi.walletSelector.off("accountsChanged", syncWalletState);
        nearClient.walletApi.walletSelector.off("networkChanged", syncWalletState);
        nearClient.walletApi.walletSelector.off("uriChanged", syncWalletState);
      }
    };
  }, [syncWalletState, isReady]);

  return (
    <WalletContext.Provider
      value={isReady ? { isReady, isSignedIn, accountId } : initialWalletContextState}
    >
      {children}
    </WalletContext.Provider>
  );
};

/**
 * To be used ONLY for session management!
 */
export const useWalletContext = () => useContext(WalletContext);
