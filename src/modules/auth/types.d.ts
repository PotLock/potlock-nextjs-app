import { WalletManager } from "@wpdas/naxios/dist/types/managers/wallet-manager";

export type Wallet = Omit<WalletManager, "changeWalletStatus" | "status">;
