import { z } from "zod";

import { addFundingSourceSchema, profileSetupSchema } from "./schemas";

export type ProfileSetupInputs = z.infer<typeof profileSetupSchema>;

export type AddFundingSourceInputs = z.infer<typeof addFundingSourceSchema>;
