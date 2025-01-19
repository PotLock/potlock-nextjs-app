import type { RegistrationStatus } from "@/common/contracts/core/lists";
import { AccountId } from "@/common/types";

export type Session =
  | {
      accountId: AccountId;
      registrationStatus?: RegistrationStatus;
      isSignedIn: true;
      isMetadataLoading: boolean;
      hasRegistrationApproved: boolean;
    }
  | {
      accountId: undefined;
      registrationStatus: undefined;
      isSignedIn: false;
      isMetadataLoading: false;
      hasRegistrationApproved: false;
    };
