import { z } from "zod";

import { Donation } from "@/common/api/indexer";

import { challengeResolveSchema, challengeSchema } from "./schemas";

export type ChallengeInputs = z.infer<typeof challengeSchema>;

export type ChallengeResolveInputs = z.infer<typeof challengeResolveSchema>;

export type CustomDonationType = Donation & {
  amount: number;
  percentage_share: string;
};
