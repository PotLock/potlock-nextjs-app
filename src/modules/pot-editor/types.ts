import { PotId } from "@/common/api/potlock";
import { PotConfig } from "@/common/contracts/potlock";

export type PotDeploymentStep = "configuration" | "result";

export type PotEditorState = {
  currentStep: PotDeploymentStep;

  finalOutcome: {
    data?: null | (PotConfig & { id: PotId });
    error?: null | Error;
  };
};
