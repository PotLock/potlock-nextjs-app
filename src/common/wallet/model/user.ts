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
        signerAccountId: undefined;
        accountId: undefined;
        registrationStatus: undefined;
        hasRegistrationSubmitted: false;
        hasRegistrationApproved: false;
        refetchRegistrationStatus: undefined;
      }
    | {
        hasWalletReady: true;
        isSignedIn: false;
        isDaoRepresentative: false;
        isHuman: false;
        isMetadataLoading: false;
        signerAccountId: undefined;
        accountId: undefined;
        registrationStatus: undefined;
        hasRegistrationSubmitted: false;
        hasRegistrationApproved: false;
        refetchRegistrationStatus: undefined;
      }
    | {
        hasWalletReady: true;
        isSignedIn: true;

        /**
         * Whether DAO authentication is enabled for a DAO
         * which the user has proposal creation privileges in.
         */
        isDaoRepresentative: boolean;

        isHuman: boolean;
        isMetadataLoading: boolean;

        /**
         * The account ID provided by the currently connected wallet instance.
         */
        signerAccountId: AccountId;

        /**
         * If `.isDaoRepresentative` is `true`, then the account ID of the currently selected DAO.
         * Otherwise, the account ID provided by the currently connected wallet instance.
         */
        accountId: AccountId;

        registrationStatus?: RegistrationStatus;
        hasRegistrationSubmitted: boolean;
        hasRegistrationApproved: boolean;
        refetchRegistrationStatus: VoidFunction;
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
