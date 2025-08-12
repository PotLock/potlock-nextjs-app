import type { FromSchema } from "@/common/types";

import { addFundingSourceSchema, profileConfigurationSchema } from "./schemas";

export type ProfileConfigurationInputs = FromSchema<typeof profileConfigurationSchema>;

export type AddFundingSourceInputs = FromSchema<typeof addFundingSourceSchema>;
