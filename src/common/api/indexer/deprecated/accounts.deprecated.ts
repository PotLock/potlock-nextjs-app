import { INDEXER_API_ENDPOINT_URL } from "@/common/_config";

type NearSocialProfileData = {
  backgroundImage:
    | string
    | {
        ipfs_cid: string;
      };
  description: string;
  image:
    | string
    | {
        ipfs_cid: string;
      };
  linktree: {
    github: string;
    telegram: string;
    twitter: string;
    website: string;
  };
  name: string;
  plCategories: string;
  plFundingSources: string;
  plGithubRepos: string;
  plPublicGoodReason: string;
  plSmartContracts: string;
  plTeam: string;
};

type User = {
  donors_count: number;
  id: string;
  total_donations_in_usd: number;
  total_donations_out_usd: number;
  total_matching_pool_allocations_usd: number;
  near_social_profile_data: NearSocialProfileData;
};

type SourceMetadata = {
  commit_hash: string;
  link: string;
  version: string;
};

type Token = {
  decimals: number;
  // "https://nearblocks.io/images/near.svg"
  icon: string;
  // near
  id: string;
  // "NEAR"
  name: string;
  // "NEAR"
  symbol: string;
};

export type DonationInfo = {
  chef: any;
  chef_fee: any;
  chef_fee_usd: any;
  donated_at: string;
  donor: User;
  token: Token;
  id: number;
  matching_pool: boolean;
  message: string;
  net_amount: string;
  net_amount_usd: string;
  on_chain_id: number;
  pot?: {
    admins: User[];
    all_paid_out: boolean;
    application_end: string;
    application_start: string;
    base_currency: string;
    chef: User;
    chef_fee_basis_points: number;
    cooldown_end: string;
    cooldown_period_ms: any;
    custom_min_threshold_score: any;
    custom_sybil_checks: any;
    deployed_at: string;
    deployer: User;
    description: string;
    id: string;
    matching_pool_balance: string;
    matching_pool_donations_count: number;
    matching_round_end: string;
    matching_round_start: string;
    max_approved_applicants: number;
    min_matching_pool_donation_amount: string;
    name: string;
    owner: User;
    pot_factory: string;
    protocol_config_provider: string;
    public_donations_count: number;
    referral_fee_matching_pool_basis_points: number;
    referral_fee_public_round_basis_points: number;
    registry_provider: string;
    source_metadata: SourceMetadata;
    sybil_wrapper_provider: any;
    total_matching_pool: string;
    total_matching_pool_usd: string;
    total_public_donations: string;
    total_public_donations_usd: string;
  };
  protocol_fee: string;
  protocol_fee_usd: string;
  recipient: {
    donors_count: number;
    id: string;
    near_social_profile_data: NearSocialProfileData;
    total_donations_in_usd: number;
    total_donations_out_usd: number;
    total_matching_pool_allocations_usd: number;
  };
  referrer: any;
  referrer_fee: any;
  referrer_fee_usd: any;
  total_amount: string;
  total_amount_usd: string;
  tx_hash: any;
};

type GetAccountDonationsReceivedResponse = {
  count: number;
  next?: string;
  previous?: string;
  results: DonationInfo[];
};

export const getAccountDonationsReceived = async ({
  accountId,
  limit,
}: {
  accountId: string;
  limit?: number;
}) => {
  const res = await fetch(
    `${INDEXER_API_ENDPOINT_URL}/api/v1/accounts/${accountId}/donations_received?limit=${limit || 9999}`,
  );
  const json = await res.json();
  return json as GetAccountDonationsReceivedResponse;
};
