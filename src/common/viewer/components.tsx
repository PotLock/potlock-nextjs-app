import { useMemo } from "react";

import { isClient } from "@wpdas/naxios";

import { WalletProvider } from "./internal/wallet-provider";

export type ViewerSessionProviderProps = {
  children: React.ReactNode;
};

/**
 * Required for session bindings to be available on the client.
 * On the server, the ssrFallback is rendered instead.
 */
export const ViewerSessionProvider: React.FC<ViewerSessionProviderProps> = ({ children }) => {
  const isCsr = useMemo(isClient, []);

  return isCsr ? <WalletProvider>{children}</WalletProvider> : children;
};
