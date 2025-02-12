import type { RegistrationStatus } from "@/common/contracts/core/lists";
import { AccountId } from "@/common/types";

type ViewerDaoRepresentativeParams =
  | { isDaoRepresentative: false; daoAccountId: undefined }
  | { isDaoRepresentative: true; daoAccountId: AccountId };

export type WalletUserSession =
  | {
      hasWalletReady: false;
      accountId: undefined;
      daoAccountId: undefined;
      isSignedIn: false;
      isDaoRepresentative: false;
      isHuman: false;
      isMetadataLoading: false;
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
      registrationStatus: undefined;
      hasRegistrationSubmitted: false;
      hasRegistrationApproved: false;
    }
  | (ViewerDaoRepresentativeParams & {
      hasWalletReady: true;
      accountId: AccountId;
      isSignedIn: true;
      isHuman: boolean;
      isMetadataLoading: boolean;
      registrationStatus?: RegistrationStatus;
      hasRegistrationSubmitted: boolean;
      hasRegistrationApproved: boolean;
    });
