import { ByPotId, PotId } from "@/common/api/indexer";
import {
  DirectBatchDonationItem,
  DirectDonation,
  DirectFTBatchDonationItem,
  PotBatchDonationItem,
  PotDonation,
} from "@/common/contracts/potlock";
import { ByAccountId, ByCampaignId, ByListId } from "@/common/types";

export type DonationGroupAllocationKey = ByPotId | ByListId | ByCampaignId;

export type DonationAllocationKey = ByAccountId | DonationGroupAllocationKey;

export type DonationStep = "allocation" | "confirmation" | "success";

export enum DonationAllocationStrategyEnum {
  full = "full",
  split = "split",
}

export type DonationAllocationStrategy =
  keyof typeof DonationAllocationStrategyEnum;

export type DonationAllocationStrategyOption = {
  label: string;
  value: DonationAllocationStrategy;
  hint?: string;
  hintIfDisabled?: string;
};

export enum DonationGroupAllocationStrategyEnum {
  evenly = "evenly",
  manually = "manually",
}

export type DonationGroupAllocationStrategy =
  keyof typeof DonationGroupAllocationStrategyEnum;

export type DonationGroupAllocationStrategyOption = {
  label: string;
  value: DonationGroupAllocationStrategy;
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
