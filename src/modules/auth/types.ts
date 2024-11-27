import { WalletManager } from "@wpdas/naxios/dist/types/managers/wallet-manager";

import { ByAccountId } from "@/common/types";

export type Wallet = Omit<WalletManager, "changeWalletStatus" | "status">;

export type AuthSession = Partial<ByAccountId> & { isSignedIn: boolean };
