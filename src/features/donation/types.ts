import { ByPotId, PotId } from "@/common/api/indexer";
import type { CampaignDonation } from "@/common/contracts/core/campaigns";
import type {
  DirectBatchDonationItem,
  DirectDonation,
  DirectFTBatchDonationItem,
} from "@/common/contracts/core/donation";
import type { PotBatchDonationItem, PotDonation } from "@/common/contracts/core/pot";
import { ByAccountId, ByCampaignId, ByListId } from "@/common/types";

export type DonationGroupAllocationKey = ByPotId | ByListId;

export type DonationAllocationKey = ByAccountId | DonationGroupAllocationKey | ByCampaignId;

export type DonationStep = "allocation" | "confirmation" | "success";

export enum DonationAllocationStrategyEnum {
  full = "full",
  share = "share",
}

export type DonationAllocationStrategy = keyof typeof DonationAllocationStrategyEnum;

export type DonationAllocationStrategyOption = {
  label: string;
  value: DonationAllocationStrategy;
  hint?: string;
  hintIfDisabled?: string;
};

export enum DonationGroupAllocationStrategyEnum {
  even = "even",
  manual = "manual",
}

export type DonationGroupAllocationStrategy = keyof typeof DonationGroupAllocationStrategyEnum;

export type DonationGroupAllocationStrategyOption = {
  label: string;
  value: DonationGroupAllocationStrategy;
  hint?: string;
  hintIfDisabled?: string;
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
  storageFeeApproximation: string;
};

export type DonationDirectBatchCallDraft = {
  entries: DirectFTBatchDonationItem[] | DirectBatchDonationItem[];
};

export type DonationPotBatchCallDraft = {
  potAccountId: PotId;
  entries: PotBatchDonationItem[];
};

export type DonationBatchCallDraft = DonationPotBatchCallDraft | DonationDirectBatchCallDraft;

export type SingleRecipientDonationReceipt = DirectDonation | PotDonation | CampaignDonation;

export type GroupDonationReceipts = DirectDonation[] | PotDonation[];
