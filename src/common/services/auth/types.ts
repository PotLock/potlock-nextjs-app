import { WalletManager } from "@wpdas/naxios/dist/types/managers/wallet-manager";

import { Account } from "@/common/api/indexer";
import { AccountId } from "@/common/types";

export type Wallet = Omit<WalletManager, "changeWalletStatus" | "status">;

export type AuthSession =
  | {
      accountId: AccountId;
      account?: Account;
      isSignedIn: true;
      isAccountInfoLoading: boolean;
      isVerifiedPublicGoodsProvider: boolean;
    }
  | {
      accountId: undefined;
      account: undefined;
      isSignedIn: false;
      isAccountInfoLoading: false;
      isVerifiedPublicGoodsProvider: false;
    };
