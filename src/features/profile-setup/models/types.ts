import type { FromSchema } from "@/common/types";

import { addFundingSourceSchema, profileSetupSchema } from "./schemas";

export type ProfileSetupInputs = FromSchema<typeof profileSetupSchema>;

export type AddFundingSourceInputs = FromSchema<typeof addFundingSourceSchema>;
