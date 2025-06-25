import { array, object, string } from "zod";

import { ACCOUNT_PROFILE_DESCRIPTION_MAX_LENGTH } from "@/entities/_shared/account";

export const addFundingSourceSchema = object({
  investorName: string({
    required_error: "Please enter the investor name.",
  })
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be less than 50 characters long"),

  date: string().optional(),

  description: string({
    required_error: "Please enter description.",
  }).max(500, "Must be less than 500 characters long"),

  amountReceived: string({
    required_error: "Please enter the investment amount.",
  }),

  denomination: string({
    required_error: "Please enter the denomination.",
  })
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be less than 50 characters"),
});

// TODO: Add cross-field validation to make repositories required
//! if one of the project categories is `AccountCategory["Open Source"]`
export const profileConfigurationSchema = object({
  name: string()
    .min(3, "Must be at least 3 characters long")
    .max(100, "Must be less than 100 characters long"),

  description: string()
    .min(20, "Must contain at least 20 characters")
    .max(
      ACCOUNT_PROFILE_DESCRIPTION_MAX_LENGTH,
      `Must be less than ${ACCOUNT_PROFILE_DESCRIPTION_MAX_LENGTH} characters long`,
    ),

  profileImage: string().min(3).optional(),
  backgroundImage: string().min(3).optional(),
  categories: array(string()).min(1),

  publicGoodReason: string()
    .min(20, "Must contain at least 20 characters")
    .max(500, "Must be less 500 characters long")
    .optional(),

  website: string().optional(),
  twitter: string().optional(),
  telegram: string().optional(),
  github: string().optional(),

  githubRepositories: array(string()).optional(),
  teamMembers: array(string()).optional(),
  smartContracts: array(array(string())).optional(),
  fundingSources: array(addFundingSourceSchema).optional(),
});
