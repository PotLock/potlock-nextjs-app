export enum ApplicationStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export type Application = {
  project_id: string;
  message: string;
  status: ApplicationStatus;
  submitted_at: number;
  updated_at: null | string;
  review_notes: null | string;
};

export interface Payout {
  id: string;
  project_id: string;
  amount: string;
  paid_at: number;
}

export interface PotDetail {
  owner: string;
  admins: string[];
  chef: string;
  pot_name: string;
  pot_description: string;
  max_projects: number;
  base_currency: "near";
  application_start_ms: number;
  application_end_ms: number;
  public_round_start_ms: number;
  public_round_end_ms: number;
  deployed_by: string;
  registry_provider: string;
  min_matching_pool_donation_amount: string;
  sybil_wrapper_provider: string;
  custom_sybil_checks: null | string;
  custom_min_threshold_score: null | string;
  referral_fee_matching_pool_basis_points: number;
  referral_fee_public_round_basis_points: number;
  chef_fee_basis_points: number;
  matching_pool_balance: string;
  total_public_donations: string;
  public_donations_count: number;
  payouts: Payout[];
  cooldown_end_ms: number | null;
  all_paid_out: boolean;
  protocol_config_provider: string;
}

export interface Challange {
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
  message: string;
  donated_at: number;
  project_id: null | string;
  referrer_id: null | string;
  referrer_fee: null | string;
  protocol_fee: string;
  matching_pool: boolean;
  chef_id: null | string;
  chef_fee: null | string;
}
