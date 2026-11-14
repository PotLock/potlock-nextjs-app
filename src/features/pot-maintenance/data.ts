import { Big } from "big.js";

import { NETWORK } from "@/common/_config";
import type { Pot } from "@/common/api/indexer";
import type { PotConfig } from "@/common/contracts/core/pot/interfaces";

import snapshot from "./historical-pots.snapshot.json";

export type HistoricalMetrics = (typeof snapshot.records)[number]["metrics"];

export type HistoricalPot = Pick<Pot, "account" | "name" | "description"> &
  Partial<Pick<Pot, "matching_round_end">> & { metrics?: HistoricalMetrics; blockHeight?: number };

export const HISTORICAL_POTS: HistoricalPot[] = NETWORK === "mainnet" ? snapshot.records : [];
export const POT_SNAPSHOT_DATE = snapshot.capturedAt.slice(0, 10);

export interface HistoricalDonationMonth {
  month: string;
  count: number;
  uniqueDonors: number;
  gross: string;
  net: string;
}

export interface CapturedPotHistory {
  account: string;
  capturedAt: string;
  blockHeight: number;
  config: Pick<
    PotConfig,
    | "pot_name"
    | "pot_description"
    | "base_currency"
    | "application_start_ms"
    | "application_end_ms"
    | "public_round_start_ms"
    | "public_round_end_ms"
    | "cooldown_end_ms"
    | "max_projects"
    | "all_paid_out"
    | "chef_fee_basis_points"
    | "referral_fee_matching_pool_basis_points"
    | "referral_fee_public_round_basis_points"
  > & { admin_count: number; chef_assigned: boolean };
  metrics: HistoricalMetrics;
  donationMonths: HistoricalDonationMonth[];
  sponsorshipMonths: HistoricalDonationMonth[];
  applicationStatuses: { status: string; count: number }[];
  applicationMonths: { month: string; status: string; count: number }[];
  payoutMonths: { month: string; count: number; amount: string }[];
}

export const formatNear = (raw: string) =>
  Big(raw)
    .div("1000000000000000000000000")
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const formatHistoryDate = (value: number | string | null | undefined) => {
  if (value === null || value === undefined) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not recorded" : date.toISOString().slice(0, 10);
};

export const getPotExplorerUrl = (accountId: string, network = NETWORK) =>
  `https://${network === "testnet" ? "testnet." : ""}nearblocks.io/address/${encodeURIComponent(accountId)}`;

export const loadCapturedPotHistory = async (url: string, account: string, block: number) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error("Historical records are unavailable.");
  const history: CapturedPotHistory = await response.json();

  if (history.account !== account || history.blockHeight !== block) {
    throw new Error("Historical records do not match this Pot snapshot.");
  }

  return history;
};

export const summarizeHistoricalPots = (records: HistoricalPot[]) => ({
  pots: records.length,
  donations: records.reduce((sum, pot) => sum + (pot.metrics?.donationCount ?? 0), 0),
  publicDonationsNet: records
    .reduce((sum, pot) => sum.plus(pot.metrics?.publicDonationsNet ?? "0"), Big(0))
    .toFixed(),
  payoutsPaid: records
    .reduce((sum, pot) => sum.plus(pot.metrics?.payoutsPaid ?? "0"), Big(0))
    .toFixed(),
});
