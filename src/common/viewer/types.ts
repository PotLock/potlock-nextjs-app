import type { RegistrationStatus } from "@/common/contracts/core/lists";
import { AccountId } from "@/common/types";

export type ViewerSession =
  | {
      hasWalletReady: false;
      accountId: undefined;
      registrationStatus: undefined;
      isSignedIn: false;
      isMetadataLoading: false;
      hasRegistrationSubmitted: false;
      hasRegistrationApproved: false;
    }
  | {
      hasWalletReady: true;
      accountId: undefined;
      registrationStatus: undefined;
      isSignedIn: false;
      isMetadataLoading: false;
      hasRegistrationSubmitted: false;
      hasRegistrationApproved: false;
    }
  | {
      hasWalletReady: true;
      accountId: AccountId;
      registrationStatus?: RegistrationStatus;
      isSignedIn: true;
      isMetadataLoading: boolean;
      hasRegistrationSubmitted: boolean;
      hasRegistrationApproved: boolean;
    };
