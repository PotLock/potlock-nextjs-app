import { z } from "zod";

export const projectEditorSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),
  isDao: z.boolean().default(false),
  daoAddress: z.string().min(3, "Invalid NEAR account ID").optional(),
  backgroundImage: z.string().min(3),
  profileImage: z.string().min(3),
  teamMembers: z.array(z.string()),
  categories: z.array(z.string()).min(1),
  description: z
    .string()
    .min(3, "Description must contain at least 20 character(s)")
    .max(500, "Description must contain at most 500 character(s)"),
  publicGoodReason: z
    .string()
    .min(3, "Reason description must contain at least 20 character(s)")
    .max(500, "Reason description must contain at most 500 character(s)"),
  smartContracts: z.array(z.array(z.string())).optional(),
  fundingSources: z
    .array(
      z.object({
        investorName: z.string(),
        date: z.string().optional(),
        description: z.string(),
        amountReceived: z.string(),
        denomination: z.string(),
      }),
    )
    .optional(),
  githubRepositories: z.array(z.string()).optional(),
  website: z.string().optional(),
  twitter: z.string().optional(),
  telegram: z.string().optional(),
  github: z.string().optional(),
});

export const addFundingSourceSchema = z.object({
  investorName: z
    .string({
      required_error: "Please enter the investor name.",
    })
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be less than 50 characters"),
  date: z.string().optional(),
  description: z
    .string({
      required_error: "Please enter description.",
    })
    .max(500, "Must be less than 500 characters"),
  amountReceived: z.string({
    required_error: "Please enter the investment amount.",
  }),
  denomination: z
    .string({
      required_error: "Please enter the denomination.",
    })
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be less than 50 characters"),
});
