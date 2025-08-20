import { object } from "zod";

import { nearProtocolSchemas } from "@/common/blockchains/near-protocol";
import type { FromSchema } from "@/common/types";

export const daoListingSchema = object({
  accountId: nearProtocolSchemas.validAccountId,
});

export type DaoListingInputs = FromSchema<typeof daoListingSchema>;
