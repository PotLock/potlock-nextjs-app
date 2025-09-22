import { AccountId, IndivisibleUnits, type TokenId } from "@/common/types";

export type CampaignsContractConfig = {
  owner: AccountId;
  admins: AccountId[];
  protocol_fee_basis_points: number;
  protocol_fee_recipient_account: AccountId;
  default_referral_fee_basis_points: number;
  default_creator_fee_basis_points: number;
  total_campaigns_count: number;
  total_donations_count: number;
};

export type CampaignInputs = {
  name: string;
  description?: string;
  cover_image_url?: string | null;
  start_ms?: number | string;
  end_ms?: number | string;
  target_amount: IndivisibleUnits;
  min_amount?: null | IndivisibleUnits;
  max_amount?: null | IndivisibleUnits;
  recipient?: AccountId;
  owner?: AccountId;
  referral_fee_basis_points?: number;
  creator_fee_basis_points?: number;
  allow_fee_avoidance?: boolean;
  project_name?: string;
  project_description?: string;
  project_banner_image_url?: string;
};

export type Campaign = {
  id: number;
  name: string;
  description: string;
  cover_image_url?: null | string;
  recipient: AccountId;
  owner: AccountId;
  start_ms: number;
  end_ms?: null | number;
  ft_id?: null | TokenId;
  target_amount: IndivisibleUnits;
  min_amount?: null | IndivisibleUnits;
  max_amount?: null | IndivisibleUnits;
  escrow_balance: IndivisibleUnits;
  referral_fee_basis_points?: null | number;
  creator_fee_basis_points?: null | number;
  allow_fee_avoidance?: boolean;
  total_raised_amount: string;
};

/**
 * https://github.com/PotLock/core/blob/6a44907c1beffcfaab7e7fbc0d50be12e897c5a8/contracts/campaigns/src/donations.rs#L51
 */
export interface CampaignDonation {
  id: number;
  campaign_id: Campaign["id"];
  donor_id: AccountId;
  total_amount: IndivisibleUnits;
  net_amount: IndivisibleUnits;
  ft_id?: null | TokenId;
  message?: null | string;
  donated_at_ms: number;
  protocol_fee: IndivisibleUnits;
  referrer_id?: null | AccountId;
  referrer_fee: IndivisibleUnits;
  creator_fee: IndivisibleUnits;
  returned_at_ms?: null | number;
  is_in_escrow: boolean;
  recipient_id: AccountId;
}

export type CampaignDonationArgs = {
  campaign_id: number;
  message?: null | string;
  referrer_id?: null | string;
  bypass_protocol_fee?: null | boolean;
  bypass_creator_fee?: null | boolean;
};
