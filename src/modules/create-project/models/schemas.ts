import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(3, "Invalid name"),
  isDao: z.boolean().default(false),
  daoAddress: z.string().min(3, "Invalid NEAR account ID"),
  projectName: z.string().min(3, "Name must be at least 3 characters"),
  backgroundImage: z.string(),
  profileImage: z.string(),
  teamMembers: z.array(z.string()),
  categories: z.array(z.string()),
  description: z.string().min(3, "Invalid description").max(500),
  publicGoodReason: z.string().min(3, "Invalid description").max(500),
  smartContracts: z.array(z.array(z.string())),
  githubRepositories: z.array(z.string()),
});
