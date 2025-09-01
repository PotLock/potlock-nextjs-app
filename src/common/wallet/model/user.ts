import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { RegistrationStatus } from "@/common/contracts/core/lists";
import { AccountId } from "@/common/types";

type WalletUserMetadata = {
  referrerAccountId?: AccountId;
};

export type WalletUserSession = WalletUserMetadata & { logout: VoidFunction } & (
    | {
        hasWalletReady: false;
        isSignedIn: false;
        isDaoRepresentative: false;
        isHuman: false;
        isMetadataLoading: false;
        signerAccountID: undefined;
        accountId: undefined;
        registrationStatus: undefined;
        hasRegistrationSubmitted: false;
        hasRegistrationApproved: false;
      }
    | {
        hasWalletReady: true;
        isSignedIn: false;
        isDaoRepresentative: false;
        isHuman: false;
        isMetadataLoading: false;
        signerAccountID: undefined;
        accountId: undefined;
        registrationStatus: undefined;
        hasRegistrationSubmitted: false;
        hasRegistrationApproved: false;
      }
    | {
        hasWalletReady: true;
        isSignedIn: true;
        isDaoRepresentative: boolean;
        isHuman: boolean;
        isMetadataLoading: boolean;
        signerAccountID: AccountId;
        accountId: AccountId;
        registrationStatus?: RegistrationStatus;
        hasRegistrationSubmitted: boolean;
        hasRegistrationApproved: boolean;
      }
  );

interface WalletUserMetadataState extends WalletUserMetadata {
  setReferrerAccountId: (accountId: AccountId | undefined) => void;
  reset: () => void;
}

export const useWalletUserMetadataStore = create<WalletUserMetadataState>()(
  persist(
    (set) => ({
      referrerAccountId: undefined,
      setReferrerAccountId: (referrerAccountId) => set({ referrerAccountId }),
      reset: () => set({ referrerAccountId: undefined }),
    }),

    { name: "wallet-user-metadata" },
  ),
);
