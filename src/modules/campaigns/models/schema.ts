import { z } from "zod";

import { near } from "@/common/api/near";
import { NETWORK } from "@/common/config";

export const campaignFormSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name must be less than 100 characters"),
    description: z
      .string()
      .max(250, "Description must be less than 100 characters")
      .optional(),
    target_amount: z.number().min(0.1, "Target amount must be at least 0.1"),
    min_amount: z
      .number()
      .min(0.1, "Min amount must be at least 0.1")
      .optional(),
    max_amount: z
      .number()
      .min(0.1, "Max amount must be at least 0.1")
      .optional(),
    cover_image_url: z.string().optional(),
    start_ms: z.string().min(1, "Start Time is Required"),
    end_ms: z.string()?.optional(),
    owner: z.string(),
    recipient: z.string().refine(near.isAccountValid, {
      message: `Account does not exist on ${NETWORK}`,
    }),
  })
  .refine(
    (data) => {
      if (data.min_amount !== undefined && data.max_amount !== undefined) {
        if (data.min_amount > data.max_amount) {
          return false; // min_amount cannot be greater than max_amount
        }
      }
      return true;
    },
    {
      message: "Min amount cannot be greater than Max amount",
      path: ["min_amount"], // Specify the path for the error
    },
  )
  .refine(
    (data) => {
      if (data.min_amount !== undefined && data.target_amount !== undefined) {
        if (data.min_amount > data.target_amount) {
          return false; // min_amount cannot be greater than target_amount
        }
      }
      return true;
    },
    {
      message: "Min amount cannot be greater than Target amount",
      path: ["min_amount"], // Specify the path for the error
    },
  )
  .refine(
    (data) => {
      if (data.max_amount !== undefined && data.target_amount !== undefined) {
        if (data.max_amount > data.target_amount) {
          return false; // max_amount cannot be greater than target_amount
        }
      }
      return true;
    },
    {
      message: "Max amount cannot be greater than Target amount",
      path: ["max_amount"], // Specify the path for the error
    },
  )
  .refine(
    (data) => {
      if (data.max_amount !== undefined && data.min_amount !== undefined) {
        if (data.max_amount < data.min_amount) {
          return false; // max_amount cannot be less than min_amount
        }
      }
      return true;
    },
    {
      message: "Max amount cannot be less than Min amount",
      path: ["max_amount"], // Specify the path for the error
    },
  );
