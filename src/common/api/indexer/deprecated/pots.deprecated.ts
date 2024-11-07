import { INDEXER_API_ENDPOINT_URL } from "@/common/_config";

import { Donation, PotPayout } from "../types";

type GetPotPayoutsResponse = {
  count: number;
  next?: string;
  previous?: string;
  results: PotPayout[];
};

export const getPotPayouts = async ({
  potId,
  pageSize,
}: {
  potId: string;
  pageSize?: number;
}) => {
  const res = await fetch(
    `${INDEXER_API_ENDPOINT_URL}/api/v1/pots/${potId}/payouts${pageSize ? `?page_size=${pageSize}` : ""}`,
  );
  const json = await res.json();
  return json as GetPotPayoutsResponse;
};

type GetPotDonationsResponse = {
  count: number;
  next?: string;
  previous?: string;
  results: Donation[];
};

export const getPotDonations = async ({
  potId,
  pageSize,
}: {
  potId: string;
  pageSize?: number;
}) => {
  const res = await fetch(
    `${INDEXER_API_ENDPOINT_URL}/api/v1/pots/${potId}/donations${pageSize ? `?page_size=${9999}` : ""}`,
  );
  const json = await res.json();
  return json as GetPotDonationsResponse;
};
