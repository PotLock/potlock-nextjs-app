import { POTLOCK_API_ENDPOINT } from "./config";
import { Donation, Pot, PotApplication, PotPayout } from "./types";

export const getPot = async ({ potId }: { potId: string }) => {
  const res = await fetch(`${POTLOCK_API_ENDPOINT}/api/v1/pots/${potId}/`);
  const json = await res.json();
  return json as Pot;
};

export const getPots = async () => {
  const res = await fetch(`${POTLOCK_API_ENDPOINT}/api/v1/pots/`);
  const json = await res.json();
  return json as Pot[];
};

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
    `${POTLOCK_API_ENDPOINT}/api/v1/pots/${potId}/payouts${pageSize ? `?page_size=${pageSize}` : ""}`,
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
    `${POTLOCK_API_ENDPOINT}/api/v1/pots/${potId}/donations${pageSize ? `?page_size=${9999}` : ""}`,
  );
  const json = await res.json();
  return json as GetPotDonationsResponse;
};

type GetPotApplicationsResponse = {
  count: number;
  next?: string;
  previous?: string;
  results: PotApplication[];
};

export const getPotApplications = async ({
  potId,
  pageSize,
}: {
  potId: string;
  pageSize?: number;
}) => {
  const res = await fetch(
    `${POTLOCK_API_ENDPOINT}/api/v1/pots/${potId}/applications${pageSize ? `?page_size=${9999}` : ""}`,
  );
  const json = await res.json();
  return json as GetPotApplicationsResponse;
};
