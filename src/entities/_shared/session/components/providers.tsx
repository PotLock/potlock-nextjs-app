import { useCallback, useEffect, useState } from "react";

import { isClient } from "@wpdas/naxios";

import { walletApi } from "@/common/api/near/client";
import { SplashScreen } from "@/common/ui/components";
import { dispatch, resetStore } from "@/store";

import { useSessionReduxStore } from "../hooks/redux-store";
import { useWallet } from "../hooks/wallet";

type SessionProviderProps = {
  children: React.ReactNode;
};

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [isReady, setReady] = useState(false);
  const { isAuthenticated } = useSessionReduxStore();
  const { wallet } = useWallet();

  // Check wallet
  const checkWallet = useCallback(async () => {
    if (wallet) {
      // Starts the wallet manager
      if (!isReady) {
        await wallet.initNear();
      }

      const isSignedIn = walletApi.walletSelector.isSignedIn();

      if (isSignedIn !== isAuthenticated) {
        dispatch.session.setAuthData({ isAuthenticated: isSignedIn });

        if (!isSignedIn) {
          // Clean up states
          resetStore();
        }
      }

      setReady(true);
    }
  }, [isAuthenticated, isReady, wallet]);

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

  return isClient() &&
    //! MyNearWallet refuses to work upon relogin without this hack
    isReady ? (
    <>{children}</>
  ) : (
    <SplashScreen className="h-screen" />
  );
};
