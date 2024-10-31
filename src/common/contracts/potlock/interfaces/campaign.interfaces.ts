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
