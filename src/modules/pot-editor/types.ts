import { PotId } from "@/common/api/potlock";
import { PotConfig } from "@/common/contracts/potlock";

export type PotEditorDeploymentStep = "configuration" | "result";

export type PotEditorState = {
  currentStep: PotEditorDeploymentStep;

  finalOutcome: {
    data?: null | (PotConfig & { id: PotId });
    error: null | Error;
  };
};
