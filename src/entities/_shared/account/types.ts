import { ByAccountId, ByRegistrationId } from "@/common/types";

export type AccountKey = {
  accountId: string;
  registrationId?: number;
  isNew?: boolean;
};
