import { useCallback, useEffect, useMemo } from "react";

import type { WalletManager } from "@wpdas/naxios/dist/types/managers/wallet-manager";
import { useRouter } from "next/router";

import { nearProtocolClient } from "@/common/blockchains/near-protocol";
import { DEBUG_ACCOUNT_ID, IS_CLIENT } from "@/common/constants";
import { isAccountId } from "@/common/lib";

import { useWalletUserMetadataStore } from "../model/user-session";
import { useWalletUserAdapter } from "../user-adapter";

//* There are edge cases where `walletSelector` is `undefined` in runtime for a brief moment
const isWalletSelectorApiAvailable = () =>
  (nearProtocolClient.walletApi.walletSelector as undefined | WalletManager["walletSelector"]) !==
  undefined;

type WalletProviderProps = {
  children: React.ReactNode;
};

const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const router = useRouter();

  const trackedQueryParams = router.query as {
    /**
     * Backward compatibility for deprecated parameter name
     */
    referrerId?: string;
    referrerAccountId?: string;
  };

  const referrerAccountIdUrlParameter = useMemo(
    () => trackedQueryParams.referrerAccountId || trackedQueryParams.referrerId,
    [trackedQueryParams.referrerAccountId, trackedQueryParams.referrerId],
  );

  const { registerInit, setAccountState, setError, isReady, isSignedIn, accountId, error } =
    useWalletUserAdapter();

  const { referrerAccountId, setReferrerAccountId } = useWalletUserMetadataStore();

  const syncWalletState = useCallback(() => {
    if (isWalletSelectorApiAvailable()) {
      const isWalletSignedIn =
        typeof DEBUG_ACCOUNT_ID === "string"
          ? true
          : nearProtocolClient.walletApi.walletSelector.isSignedIn();

      const walletAccountId =
        typeof DEBUG_ACCOUNT_ID === "string"
          ? DEBUG_ACCOUNT_ID
          : nearProtocolClient.walletApi.accountId;

      if (isWalletSignedIn !== isSignedIn || walletAccountId !== accountId) {
        setAccountState({ accountId: walletAccountId, isSignedIn: isWalletSignedIn });
      }
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
          console.error(error);
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
      isAccountId(referrerAccountIdUrlParameter) &&
      referrerAccountIdUrlParameter !== referrerAccountId &&
      referrerAccountIdUrlParameter !== accountId
    ) {
      setReferrerAccountId(referrerAccountIdUrlParameter);
      // TODO: Cleanup the query parameter once it's recorded using useRouteQuery instead of useRouter
    }
  }, [
    accountId,
    isReady,
    isSignedIn,
    referrerAccountId,
    referrerAccountIdUrlParameter,
    setReferrerAccountId,
    trackedQueryParams,
  ]);

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
