import { AccountId } from "@/common/types";

export type CampaignFormFields = {
  name: string;
  description?: string;
  cover_image_url?: string;
  start_ms: number;
  end_ms?: number;
  target_amount: number;
  min_amount?: number;
  max_amount?: number;
  recipient: AccountId;
  owner: AccountId;
};
