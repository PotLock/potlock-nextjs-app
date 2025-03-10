import { z } from "zod";

import { NETWORK } from "@/common/_config";
import { near } from "@/common/blockchains/near-protocol/client";
import { futureTimestamp } from "@/common/lib";

export const campaignFormSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name must be less than 100 characters"),
    description: z.string().max(250, "Description must be less than 100 characters"),
    target_amount: z.number().min(0.1, "Target amount must be at least 0.1"),
    min_amount: z.number().optional(),
    max_amount: z.number().optional(),
    cover_image_url: z.string().optional(),
    start_ms: futureTimestamp.describe("Campaign Start Date"),
    end_ms: futureTimestamp.describe("Campaign End Date"),
    owner: z.string()?.optional(),
    recipient: z.string().refine(near.isAccountValid, {
      message: `Account does not exist on ${NETWORK}`,
    }),
  })
  .superRefine((data, ctx) => {
    if (data.end_ms && data.start_ms >= data.end_ms) {
      ctx.addIssue({
        path: ["start_ms"],
        message: "Start time must be earlier than end time",
        code: "custom",
      });

      ctx.addIssue({
        path: ["end_ms"],
        message: "End time must be later than start time",
        code: "custom",
      });
    }
  });
