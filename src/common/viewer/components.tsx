import { useMemo } from "react";

import { isClient } from "@wpdas/naxios";

import { WalletProvider } from "../contexts/wallet";

export type ViewerSessionProviderProps = {
  children: React.ReactNode;
  fallback: React.ReactNode;
};

export const ViewerSessionProvider: React.FC<ViewerSessionProviderProps> = ({
  children,
  fallback,
}) => {
  const isClientRender = useMemo(isClient, []);

  return isClientRender ? <WalletProvider>{children}</WalletProvider> : fallback;
};
