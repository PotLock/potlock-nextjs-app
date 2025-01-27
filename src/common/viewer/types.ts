import type { RegistrationStatus } from "@/common/contracts/core/lists";
import { AccountId } from "@/common/types";

export type ViewerSession =
  | {
      hasWalletReady: false;
      accountId: undefined;
      isSignedIn: false;
      isDaoRepresentative: false;
      isMetadataLoading: false;
      registrationStatus: undefined;
      hasRegistrationSubmitted: false;
      hasRegistrationApproved: false;
    }
  | {
      hasWalletReady: true;
      accountId: undefined;
      isSignedIn: false;
      isDaoRepresentative: false;
      isMetadataLoading: false;
      registrationStatus: undefined;
      hasRegistrationSubmitted: false;
      hasRegistrationApproved: false;
    }
  | {
      hasWalletReady: true;
      accountId: AccountId;
      isSignedIn: true;
      isDaoRepresentative: boolean;
      isMetadataLoading: boolean;
      registrationStatus?: RegistrationStatus;
      hasRegistrationSubmitted: boolean;
      hasRegistrationApproved: boolean;
    };
