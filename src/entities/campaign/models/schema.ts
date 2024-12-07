import { z } from "zod";

import { NETWORK } from "@/common/_config";
import { near } from "@/common/api/near";

export const campaignFormSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name must be less than 100 characters"),
    description: z.string().max(250, "Description must be less than 100 characters").optional(),
    target_amount: z.number().min(0.1, "Target amount must be at least 0.1"),
    min_amount: z.number().optional(),
    max_amount: z.number().optional(),
    cover_image_url: z.string().optional(),
    start_ms: z.string().min(1, "Start Time is Required"),
    end_ms: z.string()?.optional(),
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

    if (data.min_amount && data.min_amount < 0.1) {
      ctx.addIssue({
        path: ["min_amount"],
        message: "Minimum amount is not allowed to be less than 0.1",
        code: "custom",
      });
    }

    if (data.max_amount && data.max_amount < 0.1) {
      ctx.addIssue({
        path: ["max_amount"],
        message: "Maximum amount is not allowed to be less than 0.1",
        code: "custom",
      });
    }

    // Validate target_amount against min_amount and max_amount
    if (data.min_amount && data.max_amount) {
      if (data.min_amount > data.max_amount) {
        ctx.addIssue({
          path: ["min_amount"],
          message: "Minimum amount cannot be greater than maximum amount",
          code: "custom",
        });
      }
    }

    if (data.target_amount < (data.min_amount ?? 0)) {
      ctx.addIssue({
        path: ["target_amount"],
        message: "Target amount cannot be less than minimum amount",
        code: "custom",
      });
    }

    if (data?.min_amount && data.target_amount < data.min_amount) {
      ctx.addIssue({
        path: ["min_amount"],
        message: "Target amount cannot be less than minimum amount",
        code: "custom",
      });
    }

    if (data.max_amount && data.target_amount > data.max_amount) {
      ctx.addIssue({
        path: ["target_amount"],
        message: "Target amount cannot be more than maximum amount",
        code: "custom",
      });
    }
  });
