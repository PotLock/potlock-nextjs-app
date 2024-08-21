import { z } from "zod";

import { fundMatchingPoolSchema, newApplicationSchema } from "./schemas";

export type FundMatchingPoolInputs = z.infer<typeof fundMatchingPoolSchema>;

export type NewApplicationInputs = z.infer<typeof newApplicationSchema>;

export type ConfigProtocol = {
  basis_points: number;
  account_id: string;
};
