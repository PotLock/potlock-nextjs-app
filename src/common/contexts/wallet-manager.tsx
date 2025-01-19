import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { WalletManager } from "@wpdas/naxios/dist/types/managers/wallet-manager";

import { nearClient } from "../api/near";

type WalletManagerContextState =
  | { isReady: false }
  | ({ isReady: true } & Omit<WalletManager, "changeWalletStatus" | "status">);

const initialWalletContextState: WalletManagerContextState = { isReady: false };

export const WalletManagerContext =
  createContext<WalletManagerContextState>(initialWalletContextState);

export type WalletManagerContextProviderProps = {
  children: React.ReactNode;
};

export const WalletManagerProvider: React.FC<WalletManagerContextProviderProps> = ({
  children,
}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    nearClient.walletApi
      .initNear()
      .then(() => setIsReady(true))
      .catch((error) => {
        console.log(error);
        setIsReady(false);
      });
  }, []);

  const resolvedContext = useMemo(
    () => (isReady ? { isReady, ...nearClient.walletApi } : initialWalletContextState),
    [isReady],
  );

  return (
    <WalletManagerContext.Provider value={resolvedContext}>
      {children}
    </WalletManagerContext.Provider>
  );
};

export const useWalletManagerContext = () => useContext(WalletManagerContext);
