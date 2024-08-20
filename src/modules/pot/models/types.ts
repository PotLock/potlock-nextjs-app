import { z } from "zod";

import { fundMatchingPoolSchema } from "./schemas";

export type FundMatchingPoolInputs = z.infer<typeof fundMatchingPoolSchema>;

export type ConfigProtocol = {
  basis_points: number;
  account_id: string;
};
