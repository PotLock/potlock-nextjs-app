import { object } from "zod";

import { nearProtocolSchemas } from "@/common/blockchains/near-protocol";
import type { AccountId, FromSchema } from "@/common/types";

export const getDaoAuthOptionSchema = (listedAccountIds: AccountId[]) =>
  object({
    accountId: nearProtocolSchemas.validAccountId,
  }).refine(({ accountId }) => !listedAccountIds.includes(accountId), {
    message: "Account is already listed",
  });

export type DaoAuthOptionInputs = FromSchema<ReturnType<typeof getDaoAuthOptionSchema>>;
