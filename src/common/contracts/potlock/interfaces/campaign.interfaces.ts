import { AccountId } from "@/common/types";

export type CampaignFormFields = {
  name: string;
  description?: string;
  cover_image_url?: string;
  start_ms?: number | string;
  end_ms?: number | string;
  target_amount: number;
  min_amount?: number;
  max_amount?: number;
  recipient?: AccountId;
  owner?: AccountId;
};

export type Campaign = {
  id: number;
  name: string;
  description?: string;
  cover_image_url?: string;
  recipient: AccountId;
  owner: AccountId;
  start_ms?: string;
  end_ms?: string;
  ftId?: AccountId;
  target_amount: string;
  min_amount?: string;
  max_amount?: string;
  referralFeeBasisPoints?: number;
  creatorFeeBasisPoints?: number;
  allowFeeAvoidance?: boolean;
  total_raised_amount: string;
};

export interface CampaignDonation {
  id: number;
  campaign_id: string;
  donor_id: string;
  recipient_id: string;
  message?: string;
  referrer_id?: string;
  protocol_fee: string;
  creator_fee?: string;
  ft_id: string;
  net_amount: string;
  total_amount: string;
  donated_at_ms: number;
  is_in_escrow: boolean;
}

export type DirectCampaignDonationArgs = {
  campaign_id: number;
  message?: string;
  referrer_id?: string;
  bypass_protocol_fee?: boolean;
  bypass_creator_fee?: boolean;
};
