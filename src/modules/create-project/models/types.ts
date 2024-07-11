import { z } from "zod";

import { addFundingSourceSchema, createProjectSchema } from "./schemas";

export type CreateProjectInputs = z.infer<typeof createProjectSchema>;

export type AddFundingSourceInputs = z.infer<typeof addFundingSourceSchema>;
