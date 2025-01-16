import { AccountId, type IndivisibleUnits, ProviderId, TokenId } from "@/common/types";

export enum ApplicationStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export enum Roles {
  Admin = "admin",
  Owner = "owner",
  Chef = "string",
}

export type Application = {
  project_id: string;
  message: string;
  status: ApplicationStatus;
  submitted_at: number;
  updated_at: null | string;
  review_notes: null | string;
};

export type ApprovedApplication = Omit<Application, "status"> & {
  status: ApplicationStatus.Approved;
};

export type PayoutInput = {
  amount: IndivisibleUnits;
  project_id: AccountId;
};

export type Payout = {
  id: string;
  project_id: string;
  amount: string;
  paid_at: number;
};

export interface PayoutDetailed extends Payout {
  totalAmount: string;
  donorCount: number;
}

export interface PotConfig {
  owner: string;
  admins: string[];
  chef?: null | string;
  pot_name: string;
  pot_description: string;
  max_projects: number;
  base_currency: TokenId; // Only supports NEAR at the moment
  application_start_ms: number;
  application_end_ms: number;
  public_round_start_ms: number;
  public_round_end_ms: number;
  deployed_by: AccountId;
  registry_provider?: null | ProviderId;
  min_matching_pool_donation_amount: string;
  sybil_wrapper_provider?: null | ProviderId;
  /** JSON string */
  custom_sybil_checks?: null | string;
  custom_min_threshold_score?: null | string;
  referral_fee_matching_pool_basis_points: number;
  referral_fee_public_round_basis_points: number;
  chef_fee_basis_points: number;
  matching_pool_balance: string;
  total_public_donations: string;
  public_donations_count: number;
  payouts: Payout[];
  cooldown_end_ms?: null | number;
  all_paid_out: boolean;
  protocol_config_provider?: null | ProviderId;
}

export type UpdatePotArgs = {
  owner?: null | AccountId;
  admins?: null | AccountId[];
  chef?: null | AccountId;
  pot_name?: null | string;
  pot_description?: null | string;
  max_projects?: null | number;
  application_start_ms?: null | number;
  application_end_ms?: null | number;
  public_round_start_ms?: null | number;
  public_round_end_ms?: null | number;
  registry_provider?: null | ProviderId;
  min_matching_pool_donation_amount?: null | string;
  sybil_wrapper_provider?: null | ProviderId;
  /** JSON string */
  custom_sybil_checks?: null | string;
  custom_min_threshold_score?: null | number;
  referral_fee_matching_pool_basis_points?: null | number;
  referral_fee_public_round_basis_points?: null | number;
  chef_fee_basis_points?: null | number;
};

export interface Challenge {
  challenger_id: string;
  created_at: number;
  reason: string;
  admin_notes: string;
  resolved: boolean;
}

export interface PotDonation {
  id: string;
  donor_id: string;
  total_amount: string;
  net_amount: string;
  message?: string | null;
  donated_at: number;
  project_id?: null | string;
  referrer_id?: null | string;
  referrer_fee?: null | string;
  protocol_fee: string;
  matching_pool: boolean;
  chef_id?: null | string;
  chef_fee?: null | string;
}

export type PotDonationArgs = {
  project_id?: null | string;
  message?: null | string;
  referrer_id?: null | string;
  bypass_protocol_fee?: null | boolean;
  custom_chef_fee_basis_points?: null | number;
};

export type PotBatchDonationItem = {
  args: PotDonationArgs;
  amountYoctoNear: string;
};
