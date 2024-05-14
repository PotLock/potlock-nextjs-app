import { ProviderExternal } from "./providers";

export interface StampExternal {
  user_id: string;
  provider: ProviderExternal;
  validated_at_ms: number;
}

export interface GetStampsForAccountIdInput {
  account_id: string;
  from_index?: number;
  limit?: number;
}

export type GetUsersForStampInput = {
  provider_id: string;
  from_index?: number;
  limit?: number;
};

export type AccountId = string;
