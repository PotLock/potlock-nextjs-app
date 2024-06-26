export interface Config {
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
  base_currency: string;
}

export type DirectDonationArgs = {
  recipient_id: string;
  message?: string | null;
  referrer_id?: string | null;
  bypass_protocol_fee?: boolean;
};
