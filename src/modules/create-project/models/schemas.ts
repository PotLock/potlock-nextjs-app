import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),
  isDao: z.boolean().default(false),
  daoAddress: z.string().min(3, "Invalid NEAR account ID"),
  projectName: z.string().min(3, "Name must be at least 3 characters"),
  backgroundImage: z.string(),
  profileImage: z.string(),
  teamMembers: z.array(z.string()),
  categories: z.array(z.string()),
  description: z
    .string()
    .min(3, "Description must contain at least 20 character(s)")
    .max(500, "Description must contain at most 500 character(s)"),
  publicGoodReason: z
    .string()
    .min(3, "Reason description must contain at least 20 character(s)")
    .max(500, "Reason description must contain at most 500 character(s)"),
  smartContracts: z.array(z.array(z.string())),
  // fundingSources: z.array(z.any()),
  fundingSources: z.array(
    z.object({
      investorName: z.string(),
      date: z.string().optional(),
      description: z.string(),
      amountReceived: z.string(),
      denomination: z.string(),
    }),
  ),
  githubRepositories: z.array(z.string()),
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
