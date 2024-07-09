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
  githubRepositories: z.array(z.string()),
});
