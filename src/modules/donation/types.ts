import { ByPotId } from "@/common/api/potlock";
import { DirectDonation } from "@/common/contracts/potlock/interfaces/donate.interfaces";
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

export enum DonationPotDistributionStrategy {
  evenly = "evenly",
  manually = "manually",
}

export type DonationPotDistributionStrategyKey =
  keyof typeof DonationPotDistributionStrategy;

export type DonationState = {
  currentStep: DonationStep;
  successResult?: DirectDonation;
};

export type DonationSubmissionInputs = ByAccountId | ByPotId;
