import { z } from "zod";

import { createProjectSchema } from "./schemas";

export type CreateProjectInputs = z.infer<typeof createProjectSchema>;
