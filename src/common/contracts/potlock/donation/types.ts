import { ByTokenId } from "@/common/types";

export interface DirectDonationConfig {
  owner: string;
  protocol_fee_basis_points: number;
  referral_fee_basis_points: number;
  protocol_fee_recipient_account: string;
  total_donations_amount: string;
  net_donations_amount: string;
  total_donations_count: string;
  total_protocol_fees: string;
  total_referrer_fees: string;
}

export interface DirectDonation {
  id: number;
  donor_id: string;
  total_amount: string;
  ft_id: string;
  message?: null | string;
  donated_at_ms: number;
  recipient_id: string;
  protocol_fee: string;
  referrer_id?: null | string;
  referrer_fee?: null | string;
}

export type DirectDonationArgs = {
  recipient_id: string;
  message?: null | string;
  referrer_id?: null | string;
  bypass_protocol_fee?: null | boolean;
};

export type DirectBatchDonationItem = {
  args: DirectDonationArgs;
  amountYoctoNear: string;
};

export type DirectFTBatchDonationItem = ByTokenId & DirectBatchDonationItem;
