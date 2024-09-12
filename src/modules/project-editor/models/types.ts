import { z } from "zod";

import { addFundingSourceSchema, projectEditorSchema } from "./schemas";

export type CreateProjectInputs = z.infer<typeof projectEditorSchema>;

export type AddFundingSourceInputs = z.infer<typeof addFundingSourceSchema>;
