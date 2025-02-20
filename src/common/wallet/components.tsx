import { useCallback, useEffect } from "react";

import { useRouter } from "next/router";

import { nearProtocolClient } from "@/common/blockchains/near-protocol";
import { IS_CLIENT } from "@/common/constants";

import { useWalletUserAdapter } from "./adapters";
import { useWalletUserMetadataStore } from "./model";
import { isAccountId } from "../lib";

type WalletProviderProps = {
  children: React.ReactNode;
};

const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const router = useRouter();

  const trackedQueryParams = router.query as {
    referrerAccountId?: string;
  };

  const { registerInit, setAccountState, setError, isReady, isSignedIn, accountId, error } =
    useWalletUserAdapter();

  const { referrerAccountId, setReferrerAccountId } = useWalletUserMetadataStore();

  const syncWalletState = useCallback(() => {
    const isWalletSignedIn = nearProtocolClient.walletApi.walletSelector.isSignedIn();
    const walletAccountId = nearProtocolClient.walletApi.accountId;

    if (isWalletSignedIn !== isSignedIn || walletAccountId !== accountId) {
      setAccountState({ accountId: walletAccountId, isSignedIn: isWalletSignedIn });
    }
  }, [accountId, isSignedIn, setAccountState]);

  const handleChange = useCallback(() => {
    syncWalletState();
    router.reload();
  }, [router, syncWalletState]);

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

      nearProtocolClient.walletApi.walletSelector.on("signedIn", handleChange);
      nearProtocolClient.walletApi.walletSelector.on("signedOut", handleChange);
      nearProtocolClient.walletApi.walletSelector.on("accountsChanged", handleChange);
      nearProtocolClient.walletApi.walletSelector.on("networkChanged", handleChange);
      nearProtocolClient.walletApi.walletSelector.on("uriChanged", handleChange);
    }

    return () => {
      if (isReady) {
        nearProtocolClient.walletApi.walletSelector.off("signedIn", handleChange);
        nearProtocolClient.walletApi.walletSelector.off("signedOut", handleChange);
        nearProtocolClient.walletApi.walletSelector.off("accountsChanged", handleChange);
        nearProtocolClient.walletApi.walletSelector.off("networkChanged", handleChange);
        nearProtocolClient.walletApi.walletSelector.off("uriChanged", handleChange);
      }
    };
  }, [syncWalletState, isReady, handleChange]);

  /**
   * Updating referrer account id, if detected
   */
  useEffect(() => {
    if (
      isReady &&
      isSignedIn &&
      isAccountId(trackedQueryParams.referrerAccountId) &&
      trackedQueryParams.referrerAccountId !== referrerAccountId &&
      trackedQueryParams.referrerAccountId !== accountId
    ) {
      setReferrerAccountId(trackedQueryParams.referrerAccountId);
    }
  }, [accountId, isReady, isSignedIn, referrerAccountId, setReferrerAccountId, trackedQueryParams]);

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
