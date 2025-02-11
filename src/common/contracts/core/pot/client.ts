import { MemoryCache, calculateDepositByDataSize } from "@wpdas/naxios";
import { parseNearAmount } from "near-api-js/lib/utils/format";

import { type ByPotId, PotId } from "@/common/api/indexer";
import { nearProtocolClient } from "@/common/blockchains/near-protocol";
import { FULL_TGAS, ONE_HUNDREDTH_NEAR } from "@/common/constants";
import type { AccountId } from "@/common/types";

import {
  Application,
  ApprovedApplication,
  Challenge,
  Payout,
  type PayoutInput,
  PotBatchDonationItem,
  PotConfig,
  PotDonation,
  PotDonationArgs,
  UpdatePotArgs,
} from "./interfaces";

const contractApi = (potId: string) =>
  nearProtocolClient.naxiosInstance.contractApi({
    contractId: potId,
    cache: new MemoryCache({ expirationTime: 10 }),
  });

// READ METHODS
/**
 * Get pot detail(config)
 */
export const get_config = (args: { potId: string }) =>
  contractApi(args.potId).view<{}, PotConfig>("get_config", { args });

/**
 * Check if round is active
 */
export const is_round_active = (args: { potId: string }) =>
  contractApi(args.potId).view<typeof args, boolean>("is_round_active", {
    args,
  });

/**
 * Get round funding donations
 */
export const get_matching_pool_donations = async (args: {
  potId: string;
  from_index?: number;
  limit?: number;
}) =>
  contractApi(args.potId).view<typeof args, PotDonation[]>("get_matching_pool_donations", {
    args,
  });

/**
 * Get round funding donations
 */
export const get_donations_for_donor = async (args: { potId: string; donor_id: string }) =>
  contractApi(args.potId).view<typeof args, PotDonation[]>("get_donations_for_donor", {
    args,
  });

/**
 * Get round donations for a project id
 */
export const get_donations_for_project = async (args: { potId: string; project_id: string }) =>
  contractApi(args.potId).view<typeof args, PotDonation[]>("get_donations_for_project", {
    args,
  });

/**
 * Get application by project id
 */
export const get_application_by_project_id = async (args: { potId: string; project_id: string }) =>
  contractApi(args.potId).view<typeof args, Application>("get_application_by_project_id", {
    args,
  });

/**
 * Get round approved applications
 */
export const get_approved_applications = async (args: { potId: string }) =>
  contractApi(args.potId).view<typeof args, ApprovedApplication[]>("get_approved_applications", {
    args,
  });

/**
 * Get round applications
 */
export const get_applications = async (args: { potId: string }) =>
  contractApi(args.potId).view<typeof args, Application[]>("get_applications", {
    args,
  });

/**
 * Get round payout challenges
 */
export const get_payouts_challenges = async (args: { potId: string }) =>
  contractApi(args.potId).view<typeof args, Challenge[]>("get_payouts_challenges");

/**
 * Get round payouts
 */
export const get_payouts = async (args: { potId: string }) =>
  contractApi(args.potId).view<typeof args, Payout[]>("get_payouts", {
    args,
  });

// WRITE METHODS
/**
 * Challenge round payout
 */
export const challenge_payouts = ({ potId, reason }: { potId: string; reason: string }) => {
  const args = { reason };
  const deposit = parseNearAmount(calculateDepositByDataSize(args))!;

  return contractApi(potId).call<{ reason: string }, Challenge[]>("challenge_payouts", {
    args,
    deposit,
    gas: FULL_TGAS,
  });
};

export const chef_set_application_status = (args: {
  potId: string;
  project_id: string;
  status: string;
  notes: string;
}) =>
  contractApi(args.potId).call<typeof args, Application>("chef_set_application_status", {
    args,
    deposit: parseNearAmount(calculateDepositByDataSize(args))!,
    gas: FULL_TGAS,
  });

export type PayoutChallengeUpdateArgs = {
  challenger_id: AccountId;
  notes?: null | string;
  resolve_challenge: boolean;
};

export const admin_update_payouts_challenge = ({
  potId,
  args,
}: ByPotId & { args: PayoutChallengeUpdateArgs }) => {
  return contractApi(potId).call<typeof args, void>("admin_update_payouts_challenge", {
    args,

    deposit:
      parseNearAmount(calculateDepositByDataSize(args)) ??
      parseNearAmount(`${(args.notes?.length ?? 1) * 0.00003}`) ??
      "0",

    gas: FULL_TGAS,
  });
};

/**
 * Admin update round payout Challenge
 */
export const chef_set_payouts = (args: { potId: string; payouts: PayoutInput[] }) =>
  contractApi(args.potId).call<typeof args, Payout[]>("chef_set_payouts", {
    args,
    deposit: "1",
    gas: FULL_TGAS,
  });

/**
 * Admin process payout
 */
export const admin_process_payouts = (args: { potId: string }) =>
  contractApi(args.potId).call<typeof args, Payout[]>("admin_process_payouts", {
    args,
    deposit: "1",
    gas: FULL_TGAS,
  });

export const donate = (potAccountId: PotId, args: PotDonationArgs, depositAmountYocto: string) =>
  contractApi(potAccountId).call<typeof args, PotDonation>("donate", {
    args,
    deposit: depositAmountYocto,
    callbackUrl: window.location.href,
  });

export const donateBatch = (potAccountId: PotId, txDrafts: PotBatchDonationItem[]) =>
  contractApi(potAccountId).callMultiple<PotDonationArgs>(
    txDrafts.map(({ amountYoctoNear, ...txDraft }) => ({
      method: "donate",
      deposit: amountYoctoNear,
      gas: FULL_TGAS,
      ...txDraft,
    })),

    window.location.href,
  );

export const admin_dangerously_set_pot_config = (
  potAccountId: PotId,
  args: { update_args: UpdatePotArgs },
) =>
  contractApi(potAccountId).call<typeof args, PotConfig>(
    "admin_dangerously_set_pot_config",

    {
      args,
      deposit: ONE_HUNDREDTH_NEAR,
      gas: FULL_TGAS,
      callbackUrl: window.location.href,
    },
  );
