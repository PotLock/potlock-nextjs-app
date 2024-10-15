import { ByAccountId, ByRegistrationId } from "@/common/types";

export type AccountKey = ByAccountId & Partial<ByRegistrationId>;
