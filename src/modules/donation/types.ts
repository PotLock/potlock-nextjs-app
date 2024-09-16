import { ByPotId } from "@/common/api/potlock";
import { DirectDonation } from "@/common/contracts/potlock/interfaces/donate.interfaces";
import { PotDonation } from "@/common/contracts/potlock/interfaces/pot.interfaces";
import { ByAccountId } from "@/common/types";

export type DonationParameters = ByAccountId | ByPotId;

export type DonationStep = "allocation" | "confirmation" | "success";

export enum DonationAllocationStrategyEnum {
  direct = "direct",
  pot = "pot",
}

export type DonationAllocationStrategy =
  keyof typeof DonationAllocationStrategyEnum;

export type DonationAllocationStrategyOption = {
  label: string;
  value: DonationAllocationStrategy;
  hint?: string;
  hintIfDisabled?: string;
};

export enum DonationPotDistributionStrategyEnum {
  evenly = "evenly",
  manually = "manually",
}

export type DonationPotDistributionStrategy =
  keyof typeof DonationPotDistributionStrategyEnum;

export type DonationPotDistributionStrategyOption = {
  label: string;
  value: DonationPotDistributionStrategy;
  hint?: string;
  hintIfDisabled?: string;
};

export type DonationState = {
  currentStep: DonationStep;
  finalOutcome?: DirectDonation | PotDonation;
};

export type DonationSubmissionInputs = ByAccountId | ByPotId;
