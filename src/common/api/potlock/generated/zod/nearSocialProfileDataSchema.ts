import { z } from "zod";

import { imageSchema } from "./imageSchema";
import { linktreeSchema } from "./linktreeSchema";

export const nearSocialProfileDataSchema = z.object({
  name: z.string().optional(),
  image: z.lazy(() => imageSchema).optional(),
  backgroundImage: z.lazy(() => imageSchema).optional(),
  description: z.string().optional(),
  linktree: z.lazy(() => linktreeSchema).optional(),
  plPublicGoodReason: z.string().optional(),
  plCategories: z
    .string()
    .describe("JSON-stringified array of category strings")
    .optional(),
  plGithubRepos: z
    .string()
    .describe("JSON-stringified array of URLs")
    .optional(),
  plSmartContracts: z
    .string()
    .describe(
      "JSON-stringified object with chain names as keys that map to nested objects of contract addresses",
    )
    .optional(),
  plFundingSources: z
    .string()
    .describe("JSON-stringified array of funding source objects")
    .optional(),
  plTeam: z
    .string()
    .describe("JSON-stringified array of team member account ID strings")
    .optional(),
});
