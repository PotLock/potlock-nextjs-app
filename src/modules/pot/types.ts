import { PotDeploymentResult } from "@/common/contracts/potlock";

export type PotDeploymentStep = "configuration" | "result";

export type PotState = {
  deployment: {
    currentStep: PotDeploymentStep;
    finalOutcome: { data?: PotDeploymentResult; error?: Error };
  };
};