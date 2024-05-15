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

export const getAccounts = async () => {
  const res = await fetch(`${URI}/accounts`);
  const json = await res.json();
  return json as GetAccountsResponse;
};
