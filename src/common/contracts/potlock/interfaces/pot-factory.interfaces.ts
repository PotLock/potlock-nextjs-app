import { PotId } from "@/common/api/indexer";
import { AccountId, ProviderId } from "@/common/types";

export type PotDeploymentResult = {
  id: PotId;
  deployed_by: string;
  deployed_at_ms: number;
};

/**
 * Weighting for a given CustomSybilCheck
 */
export type SybilProviderWeight = number;

/**
 * Passed down to the resulting pot contract
 */
export type CustomSybilCheck = {
  contract_id: AccountId;
  method_name: string;
  weight: SybilProviderWeight;
};

export interface PotFactoryConfig {
  owner: string;
  admins: string[];
  protocol_fee_basis_points: number;
  protocol_fee_recipient_account: string;
  whitelisted_deployers: string[];
  require_whitelist: boolean;
}

export interface ProtocolConfig {
  basis_points: number;
  account_id: string;
}

export type ContractSourceMetadata = {
  version: string;
  commit_hash: string;
  link: string;
};

export type PotArgs = {
  owner?: null | AccountId;
  admins?: null | AccountId[];
  chef?: null | AccountId;
  pot_name: string;
  pot_description: string;
  max_projects: number;
  application_start_ms: number;
  application_end_ms: number;
  public_round_start_ms: number;
  public_round_end_ms: number;
  min_matching_pool_donation_amount?: null | string;
  cooldown_period_ms?: null | number;
  registry_provider?: null | ProviderId;
  sybil_wrapper_provider?: null | ProviderId;
  custom_sybil_checks?: null | CustomSybilCheck[];
  custom_min_threshold_score?: null | number;
  referral_fee_matching_pool_basis_points: number;
  referral_fee_public_round_basis_points: number;
  chef_fee_basis_points: number;
  protocol_config_provider?: null | ProviderId;
  source_metadata: ContractSourceMetadata;
};
