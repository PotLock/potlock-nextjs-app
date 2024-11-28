import { WalletManager } from "@wpdas/naxios/dist/types/managers/wallet-manager";

import { Account } from "@/common/api/indexer";
import { AccountId } from "@/common/types";

export type Wallet = Omit<WalletManager, "changeWalletStatus" | "status">;

export type AuthSession =
  | {
      isSignedIn: true;
      accountId: AccountId;
      account?: Account;
      isVerifiedPublicGoodsProvider: boolean;
    }
  | {
      isSignedIn: false;
      accountId: undefined;
      account: undefined;
      isVerifiedPublicGoodsProvider: false;
    };
