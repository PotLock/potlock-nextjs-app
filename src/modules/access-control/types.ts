import { BasicRequirement } from "@/common/types";

export type AccessControlClearanceCheckResult =
  | { requirements: BasicRequirement[]; isEveryRequirementSatisfied: boolean; error: null }
  | { requirements: null; isEveryRequirementSatisfied: false; error: Error };
