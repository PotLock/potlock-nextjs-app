import { useEffect, useState } from "react";

import { WalletManager } from "@wpdas/naxios/dist/types/managers/wallet-manager";

import { walletApi } from "@/common/api/near/client";

export type Wallet = Omit<WalletManager, "changeWalletStatus" | "status">;

export const useWallet = () => {
  const [isWalletReady, setReady] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [wallet, setWallet] = useState<Wallet>();

  useEffect(() => {
    (async () => {
      // Starts the wallet manager
      await walletApi.initNear();

      const isSignedIn = walletApi.walletSelector.isSignedIn();
      setIsSignedIn(isSignedIn);
      setWallet(walletApi);
      setReady(true);
    })();
  }, []);

  return {
    isWalletReady,
    isSignedIn,
    wallet,
  };
};

export type WalletContext = {};
