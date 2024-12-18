import { useCallback, useEffect, useState } from "react";

//import { isClient } from "@wpdas/naxios";

import { walletApi } from "@/common/api/near/client";
import useIsClient from "@/common/lib/useIsClient";
import { SplashScreen } from "@/common/ui/components";
import { dispatch, resetStore } from "@/store";

import { useSessionReduxStore } from "../hooks/redux-store";
import { useWallet } from "../hooks/wallet";

type SessionProviderProps = {
  children: React.ReactNode;
};

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [ready, setReady] = useState(false);
  const { isAuthenticated } = useSessionReduxStore();
  const isClient = useIsClient();
  const { wallet } = useWallet();

  // Check wallet
  const checkWallet = useCallback(async () => {
    if (wallet) {
      // Starts the wallet manager
      await wallet.initNear();

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

  return isClient ? <>{children}</> : <SplashScreen className="h-screen" />;
};
