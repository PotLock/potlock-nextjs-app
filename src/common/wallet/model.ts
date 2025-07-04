import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { RegistrationStatus } from "@/common/contracts/core/lists";
import { AccountId } from "@/common/types";

export type WalletUserDaoRepresentativeParams =
  | { isDaoRepresentative: false; daoAccountId: undefined }
  | { isDaoRepresentative: true; daoAccountId: AccountId };

export type WalletUserMetadata = {
  referrerAccountId?: AccountId;
};

export type WalletUserSession = WalletUserMetadata &
  (
    | {
        hasWalletReady: false;
        accountId: undefined;
        daoAccountId: undefined;
        isSignedIn: false;
        isDaoRepresentative: false;
        isHuman: false;
        isMetadataLoading: false;
        canSubmitDaoProposals: false;
        registrationStatus: undefined;
        hasRegistrationSubmitted: false;
        hasRegistrationApproved: false;
      }
    | {
        hasWalletReady: true;
        accountId: undefined;
        daoAccountId: undefined;
        isSignedIn: false;
        isDaoRepresentative: false;
        isHuman: false;
        isMetadataLoading: false;
        canSubmitDaoProposals: false;
        registrationStatus: undefined;
        hasRegistrationSubmitted: false;
        hasRegistrationApproved: false;
      }
    | (WalletUserDaoRepresentativeParams & {
        hasWalletReady: true;
        accountId: AccountId;
        isSignedIn: true;
        isHuman: boolean;
        isMetadataLoading: boolean;
        canSubmitDaoProposals: boolean;
        registrationStatus?: RegistrationStatus;
        hasRegistrationSubmitted: boolean;
        hasRegistrationApproved: boolean;
      })
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

    {
      name: "wallet-user-metadata",
    },
  ),
);
