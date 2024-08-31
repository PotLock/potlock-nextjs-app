import { Pot } from "@/common/contracts/potlock/interfaces/pot-factory.interfaces";

export type PotDeploymentStep = "configuration" | "success";

export type PotState = {
  deployment: {
    currentStep: PotDeploymentStep;
    successResult?: Pot;
  };
};
