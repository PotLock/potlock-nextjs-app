import { ByPotId, PotId } from "@/common/api/potlock";
import {
  DirectBatchDonationItem,
  DirectDonation,
  DirectFTBatchDonationItem,
  PotBatchDonationItem,
  PotDonation,
} from "@/common/contracts/potlock";
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

export type DonationDirectBatchCallDraft = {
  entries: DirectFTBatchDonationItem[] | DirectBatchDonationItem[];
};

export type DonationPotBatchCallDraft = {
  potAccountId: PotId;
  entries: PotBatchDonationItem[];
};

export type DonationBatchCallDraft =
  | DonationPotBatchCallDraft
  | DonationDirectBatchCallDraft;
