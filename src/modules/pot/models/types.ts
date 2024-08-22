import { z } from "zod";

import {
  challengeSchema,
  fundMatchingPoolSchema,
  newApplicationSchema,
} from "./schemas";

export type FundMatchingPoolInputs = z.infer<typeof fundMatchingPoolSchema>;

export type NewApplicationInputs = z.infer<typeof newApplicationSchema>;

export type ChallengeInputs = z.infer<typeof challengeSchema>;

export type ConfigProtocol = {
  basis_points: number;
  account_id: string;
};
