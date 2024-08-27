import { useEffect, useState } from "react";

import { walletApi } from "@/common/api/near";

import { Wallet } from "../types";

const useWallet = () => {
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

export default useWallet;
