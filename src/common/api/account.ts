import { URI } from "./API";

type Accounts = {
  id: string;
  donors_count: number;
  total_donations_in_usd: string;
  total_donations_out_usd: string;
  total_matching_pool_allocations_usd: string;
};

type GetAccountsResponse = {
  count: number;
  next?: string;
  previous?: string;
  results: Accounts[];
};

export type DonationInfo = {
  chef: any;
  chef_fee: any;
  chef_fee_usd: any;
  donated_at: string;
  donor: string;
  ft: string;
  id: number;
  matching_pool: boolean;
  message: string;
  net_amount: string;
  net_amount_usd: string;
  on_chain_id: number;
  pot: any;
  protocol_fee: string;
  protocol_fee_usd: string;
  recipient: string;
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

export const getAccounts = async () => {
  const res = await fetch(`${URI}/accounts`);
  const json = await res.json();
  return json as GetAccountsResponse;
};

export const getAccount = async ({ accountId }: { accountId: string }) => {
  const res = await fetch(`${URI}/accounts/${accountId}`);
  const json = await res.json();
  return json as GetAccountsResponse;
};

export const getAccountDonationsReceived = async ({
  accountId,
}: {
  accountId: string;
}) => {
  const res = await fetch(`${URI}/accounts/${accountId}/donations_received`);
  const json = await res.json();
  return json as GetAccountDonationsReceivedResponse;
};
