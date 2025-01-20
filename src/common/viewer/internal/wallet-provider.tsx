import { useCallback, useEffect, useState } from "react";

import { nearClient } from "@/common/api/near";

import { WalletContext, useWalletContextStore } from "./wallet-context";

export type WalletProviderProps = {
  children: React.ReactNode;
};

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [error, setError] = useState<unknown>(null);
  const { initialize, setIsSignedIn, setAccountId, ...contextState } = useWalletContextStore();

  const syncWalletState = useCallback(() => {
    setIsSignedIn(nearClient.walletApi.walletSelector.isSignedIn());
    setAccountId(nearClient.walletApi.accountId);
  }, [setAccountId, setIsSignedIn]);

  useEffect(() => {
    if (!contextState.isReady && error === null) {
      nearClient.walletApi
        .initNear()
        .then(() => initialize(true))
        .catch((error) => {
          console.log(error);
          setError(error);
        });
    }
  }, [error, initialize, contextState.isReady]);

  useEffect(() => {
    if (contextState.isReady) {
      syncWalletState();

      nearClient.walletApi.walletSelector.on("signedIn", syncWalletState);
      nearClient.walletApi.walletSelector.on("signedOut", syncWalletState);
      nearClient.walletApi.walletSelector.on("accountsChanged", syncWalletState);
      nearClient.walletApi.walletSelector.on("networkChanged", syncWalletState);
      nearClient.walletApi.walletSelector.on("uriChanged", syncWalletState);
    }

    return () => {
      if (contextState.isReady) {
        nearClient.walletApi.walletSelector.off("signedIn", syncWalletState);
        nearClient.walletApi.walletSelector.off("signedOut", syncWalletState);
        nearClient.walletApi.walletSelector.off("accountsChanged", syncWalletState);
        nearClient.walletApi.walletSelector.off("networkChanged", syncWalletState);
        nearClient.walletApi.walletSelector.off("uriChanged", syncWalletState);
      }
    };
  }, [syncWalletState, contextState.isReady]);

  return <WalletContext.Provider value={contextState}>{children}</WalletContext.Provider>;
};
