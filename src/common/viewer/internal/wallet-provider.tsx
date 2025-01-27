import { useCallback, useEffect } from "react";

import { nearClient } from "@/common/api/near-protocol";

import { useWalletContextStore } from "./wallet-context";

export type WalletProviderProps = {
  children: React.ReactNode;
};

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const { registerInit, setAccountState, setError, isReady, isSignedIn, accountId, error } =
    useWalletContextStore();

  const syncWalletState = useCallback(() => {
    const isWalletSignedIn = nearClient.walletApi.walletSelector.isSignedIn();
    const walletAccountId = nearClient.walletApi.accountId;

    if (isWalletSignedIn !== isSignedIn || walletAccountId !== accountId) {
      setAccountState({ accountId: walletAccountId, isSignedIn: isWalletSignedIn });
    }
  }, [accountId, isSignedIn, setAccountState]);

  useEffect(() => {
    if (!isReady && error === null) {
      nearClient.walletApi
        .initNear()
        .then(() => registerInit(true))
        .catch((error) => {
          console.log(error);
          setError(error);
        });
    }
  }, [error, isReady, registerInit, setError]);

  useEffect(() => {
    if (isReady) {
      syncWalletState();

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

  return children;
};
