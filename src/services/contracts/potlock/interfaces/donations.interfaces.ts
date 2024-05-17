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

export interface DirectDonation {
  id: string;
  donor_id: string;
  total_amount: string;
  ft_id: string;
  message: string;
  donated_at_ms: number;
  recipient_id: string;
  protocol_fee: string;
  referrer_id: null | string;
  referrer_fee: null | string;
}
