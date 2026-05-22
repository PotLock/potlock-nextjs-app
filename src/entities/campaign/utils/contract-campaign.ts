import type { Campaign as IndexerCampaign } from "@/common/api/indexer/internal/client.generated";
import { NATIVE_TOKEN_DECIMALS, NATIVE_TOKEN_ID } from "@/common/constants";
import type { Campaign as ContractCampaign } from "@/common/contracts/core/campaigns/interfaces";

const msToIsoString = (ms: number | null | undefined): string | null => {
  if (!ms) return null;
  return new Date(ms).toISOString();
};

export const mapContractCampaignToIndexerFormat = (
  contractCampaign: ContractCampaign,
): IndexerCampaign => {
  const now = Date.now();
  let status = "active";

  if (contractCampaign.start_ms > now) {
    status = "pending";
  } else if (contractCampaign.end_ms && contractCampaign.end_ms < now) {
    status = "completed";
  }

  return {
    on_chain_id: contractCampaign.id,
    name: contractCampaign.name,
    description: contractCampaign.description || null,
    cover_image_url: contractCampaign.cover_image_url || null,
    created_at: new Date().toISOString(),
    start_at: msToIsoString(contractCampaign.start_ms) ?? new Date().toISOString(),
    end_at: msToIsoString(contractCampaign.end_ms ?? null),
    owner: {
      id: contractCampaign.owner,
      donors_count: 0,
      total_donations_in_usd: 0,
      total_donations_out_usd: 0,
      total_matching_pool_allocations_usd: 0,
    },
    recipient: {
      id: contractCampaign.recipient,
      donors_count: 0,
      total_donations_in_usd: 0,
      total_donations_out_usd: 0,
      total_matching_pool_allocations_usd: 0,
    },
    token: {
      account: contractCampaign.ft_id ?? NATIVE_TOKEN_ID,
      decimals: NATIVE_TOKEN_DECIMALS,
      name: contractCampaign.ft_id ?? "NEAR",
      symbol: contractCampaign.ft_id?.toUpperCase() ?? "NEAR",
    },
    target_amount: contractCampaign.target_amount,
    min_amount: contractCampaign.min_amount ?? null,
    max_amount: contractCampaign.max_amount ?? null,
    escrow_balance: contractCampaign.escrow_balance,
    net_raised_amount: contractCampaign.total_raised_amount ?? "0",
    total_raised_amount: contractCampaign.total_raised_amount ?? "0",
    referral_fee_basis_points: contractCampaign.referral_fee_basis_points ?? 0,
    creator_fee_basis_points: contractCampaign.creator_fee_basis_points ?? 0,
    allow_fee_avoidance: contractCampaign.allow_fee_avoidance ?? false,
    status,
  };
};
