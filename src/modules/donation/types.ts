import { ByPotId, PotId } from "@/common/api/potlock";
import {
  DirectBatchDonationItem,
  DirectDonation,
  DirectFTBatchDonationItem,
  PotBatchDonationItem,
  PotDonation,
} from "@/common/contracts/potlock";
import { ByAccountId } from "@/common/types";

export type DonationAllocationKey = ByAccountId | ByPotId;

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

export enum DonationShareAllocationStrategyEnum {
  evenly = "evenly",
  manually = "manually",
}

export type DonationShareAllocationStrategy =
  keyof typeof DonationShareAllocationStrategyEnum;

export type DonationShareAllocationStrategyOption = {
  label: string;
  value: DonationShareAllocationStrategy;
  hint?: string;
  hintIfDisabled?: string;
};

export type DonationState = {
  currentStep: DonationStep;
  finalOutcome?: DirectDonation | PotDonation;
};

export interface WithTotalAmount {
  totalAmountFloat: number;
}

export type DonationBreakdown = {
  projectAllocationAmount: number;
  projectAllocationPercent: number;
  protocolFeeAmount: number;
  protocolFeePercent: number;
  protocolFeeRecipientAccountId?: string;
  referralFeeAmount: number;
  referralFeePercent: number;
  chefFeeAmount: number;
  chefFeePercent: number;
};

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
