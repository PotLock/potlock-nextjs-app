import { useEffect, useState } from "react";

import { WalletManager } from "@wpdas/naxios/dist/types/managers/wallet-manager";

import { walletApi } from "@app/services/contracts";

const useWallet = () => {
  const [isWalletReady, setReady] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [wallet, setWallet] =
    useState<Omit<WalletManager, "changeWalletStatus" | "status">>();

  useEffect(() => {
    (async () => {
      // Starts the wallet manager
      await walletApi.initNear();

      const isSignedIn = walletApi.walletSelector.isSignedIn();
      setIsSignedIn(isSignedIn);

      if (isSignedIn) {
        setWallet(walletApi);
      }

      setReady(true);
    })();
  }, []);

  return {
    isWalletReady,
    isSignedIn,
    wallet,
  };
};

export default useWallet;
