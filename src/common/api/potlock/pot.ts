import { POTLOCK_API_ENDPOINT } from "@/common/constants";

import { Pot, PotPayout } from "./types";

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

export const getPotPayouts = async ({ potId }: { potId: string }) => {
  const res = await fetch(
    `${POTLOCK_API_ENDPOINT}/api/v1/pots/${potId}/payouts`,
  );
  const json = await res.json();
  return json as GetPotPayoutsResponse;
};
