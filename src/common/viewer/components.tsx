import { IS_CLIENT } from "../constants";
import { WalletProvider } from "./internal/wallet-provider";

export type ViewerSessionProviderProps = {
  children: React.ReactNode;
};

/**
 * Required for wallet and session bindings to be available on the client.
 */
export const ViewerSessionProvider: React.FC<ViewerSessionProviderProps> = ({ children }) =>
  IS_CLIENT ? <WalletProvider>{children}</WalletProvider> : children;
