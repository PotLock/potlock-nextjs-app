import { useCallback, useEffect, useState } from "react";

import { walletApi } from "@/common/contracts";
import useIsClient from "@/common/hooks/useIsClient";
import SuspenseLoading from "@/modules/auth/components/SuspenseLoading";
import { dispatch, resetStore } from "@/modules/core/store";

import { useAuth } from "../hooks/useAuth";
import useWallet from "../hooks/useWallet";

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [ready, setReady] = useState(false);
  const { isAuthenticated } = useAuth();
  const { wallet } = useWallet();
  const isClient = useIsClient();

  // Check wallet
  const checkWallet = useCallback(async () => {
    if (wallet) {
      // Starts the wallet manager
      await wallet.initNear();

      const isSignedIn = walletApi.walletSelector.isSignedIn();

      if (isSignedIn !== isAuthenticated) {
        dispatch.auth.setAuthData({ isAuthenticated: isSignedIn });

        if (!isSignedIn) {
          // Clean up states
          resetStore();
        }
      }
      setReady(true);
    }
  }, [isAuthenticated, wallet]);

  // Re-init when user is signed in
  useEffect(() => {
    if (wallet) {
      // Initial wallet state
      checkWallet();

      // On sign in wallet state
      walletApi.walletSelector.on("signedIn", checkWallet);

      // On sign out wallet state
      walletApi.walletSelector.on("signedOut", checkWallet);
    }

    return () => {
      if (wallet) {
        wallet.walletSelector.off("signedIn", checkWallet);
        wallet.walletSelector.off("signedOut", checkWallet);
      }
    };
  }, [checkWallet, wallet]);

  if (!wallet || !isClient || !ready) {
    return <SuspenseLoading />;
  }

  return <>{children}</>;
};
