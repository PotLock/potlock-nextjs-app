import { z } from "zod";

export const createProjectSchema = z.object({
  isDao: z.boolean().default(false),
  daoAddress: z.string().min(3, "Invalid NEAR account ID"),
  projectName: z.string().min(3, "Name must be at least 3 characters"),
  backgroundImage: z.string(),
  profileImage: z.string(),
});
