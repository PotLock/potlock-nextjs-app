import { useCallback, useEffect } from "react";

import { nearProtocolClient } from "@/common/api/near-protocol";
import { IS_CLIENT } from "@/common/constants";

import { useWalletUserAdapterContext } from "./adapters/user";

type WalletProviderProps = {
  children: React.ReactNode;
};

const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const { registerInit, setAccountState, setError, isReady, isSignedIn, accountId, error } =
    useWalletUserAdapterContext();

  const syncWalletState = useCallback(() => {
    const isWalletSignedIn = nearProtocolClient.walletApi.walletSelector.isSignedIn();
    const walletAccountId = nearProtocolClient.walletApi.accountId;

    if (isWalletSignedIn !== isSignedIn || walletAccountId !== accountId) {
      setAccountState({ accountId: walletAccountId, isSignedIn: isWalletSignedIn });
    }
  }, [accountId, isSignedIn, setAccountState]);

  useEffect(() => {
    if (!isReady && error === null) {
      nearProtocolClient.walletApi
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

      nearProtocolClient.walletApi.walletSelector.on("signedIn", syncWalletState);
      nearProtocolClient.walletApi.walletSelector.on("signedOut", syncWalletState);
      nearProtocolClient.walletApi.walletSelector.on("accountsChanged", syncWalletState);
      nearProtocolClient.walletApi.walletSelector.on("networkChanged", syncWalletState);
      nearProtocolClient.walletApi.walletSelector.on("uriChanged", syncWalletState);
    }

    return () => {
      if (isReady) {
        nearProtocolClient.walletApi.walletSelector.off("signedIn", syncWalletState);
        nearProtocolClient.walletApi.walletSelector.off("signedOut", syncWalletState);
        nearProtocolClient.walletApi.walletSelector.off("accountsChanged", syncWalletState);
        nearProtocolClient.walletApi.walletSelector.off("networkChanged", syncWalletState);
        nearProtocolClient.walletApi.walletSelector.off("uriChanged", syncWalletState);
      }
    };
  }, [syncWalletState, isReady]);

  return children;
};

export type WalletUserSessionProviderProps = {
  children: React.ReactNode;
};

/**
 * Required for wallet and session bindings to be available on the client.
 */
export const WalletUserSessionProvider: React.FC<WalletUserSessionProviderProps> = ({
  children,
}) => (IS_CLIENT ? <WalletProvider>{children}</WalletProvider> : children);
