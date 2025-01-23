import { WalletManager } from "@wpdas/naxios/dist/types/managers/wallet-manager";

import type { RegistrationStatus } from "@/common/contracts/core/lists";
import { AccountId } from "@/common/types";

export type Wallet = Omit<WalletManager, "changeWalletStatus" | "status">;

export type UserSession =
  | {
      accountId: AccountId;
      registrationStatus?: RegistrationStatus;
      isSignedIn: true;
      isDaoRepresentative: boolean;
      isMetadataLoading: boolean;
      hasRegistrationApproved: boolean;
    }
  | {
      accountId: undefined;
      registrationStatus: undefined;
      isSignedIn: false;
      isDaoRepresentative: false;
      isMetadataLoading: false;
      hasRegistrationApproved: false;
    };
