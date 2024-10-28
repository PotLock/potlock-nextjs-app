import { MemoryCache, calculateDepositByDataSize } from "@wpdas/naxios";
import { parseNearAmount } from "near-api-js/lib/utils/format";

import { PotId } from "@/common/api/indexer";
import { naxiosInstance } from "@/common/api/near";
import { FULL_TGAS, ONE_HUNDREDTH_NEAR } from "@/common/constants";

import {
  Application,
  ApprovedApplication,
  Challenge,
  Payout,
  PotBatchDonationItem,
  PotConfig,
  PotDonation,
  PotDonationArgs,
  UpdatePotArgs,
} from "./interfaces/pot.interfaces";

/**
 * NEAR Contract API
 */
export const contractApi = (potId: string) =>
  naxiosInstance.contractApi({
    contractId: potId,
    cache: new MemoryCache({ expirationTime: 10 }), // 10 seg
  });

// READ METHODS
/**
 * Get pot detail(config)
 */
export const getConfig = (args: { potId: string }) =>
  contractApi(args.potId).view<{}, PotConfig>("get_config", { args });

/**
 * Check if round is active
 */
export const getList = (args: { potId: string }) =>
  contractApi(args.potId).view<typeof args, boolean>("is_round_active", {
    args,
  });

/**
 * Get round funding donations
 */
export const getMatchingPoolDonations = async (args: {
  potId: string;
  from_index?: number;
  limit?: number;
}) =>
  contractApi(args.potId).view<typeof args, PotDonation[]>(
    "get_matching_pool_donations",
    {
      args,
    },
  );

/**
 * Get round funding donations
 */
export const getDonationsForDonor = async (args: {
  potId: string;
  donor_id: string;
}) =>
  contractApi(args.potId).view<typeof args, PotDonation[]>(
    "get_donations_for_donor",
    {
      args,
    },
  );

/**
 * Get round donations for a project id
 */
export const getDonationsForProject = async (args: {
  potId: string;
  project_id: string;
}) =>
  contractApi(args.potId).view<typeof args, PotDonation[]>(
    "get_donations_for_project",
    {
      args,
    },
  );

/**
 * Get application by project id
 */
export const getApplicationByProjectId = async (args: {
  potId: string;
  project_id: string;
}) =>
  contractApi(args.potId).view<typeof args, Application>(
    "get_application_by_project_id",
    {
      args,
    },
  );

/**
 * Get round approved applications
 */
export const getApprovedApplications = async (args: { potId: string }) =>
  contractApi(args.potId).view<typeof args, ApprovedApplication[]>(
    "get_approved_applications",
    {
      args,
    },
  );

/**
 * Get round applications
 */
export const getApplications = async (args: { potId: string }) =>
  contractApi(args.potId).view<typeof args, Application[]>("get_applications", {
    args,
  });

/**
 * Get round payout challanges
 */
export const getPayoutsChallenges = async (args: { potId: string }) =>
  contractApi(args.potId).view<typeof args, Challenge[]>(
    "get_payouts_challenges",
  );

/**
 * Get round payouts
 */
export const getPayouts = async (args: { potId: string }) =>
  contractApi(args.potId).view<typeof args, Payout[]>("get_payouts", {
    args,
  });

// WRITE METHODS
/**
 * Challenge round payout
 */
export const challengePayouts = ({
  potId,
  reason,
}: {
  potId: string;
  reason: string;
}) => {
  const args = { reason };
  const deposit = parseNearAmount(calculateDepositByDataSize(args))!;

  return contractApi(potId).call<{ reason: string }, Challenge[]>(
    "challenge_payouts",
    {
      args,
      deposit,
      gas: FULL_TGAS,
    },
  );
};

/**
 * Admin update round payout Challenge
 */
export const adminUpdatePayoutsChallenge = (args: {
  potId: string;
  challengerId: string;
  notes: string;
  shouldResolveChallenge: boolean;
}) => {
  const depositFloat = args.notes.length * 0.00003;

  contractApi(args.potId).call<typeof args, Challenge[]>(
    "admin_update_payouts_challenge",
    {
      args,
      deposit: `${depositFloat}`,
      gas: FULL_TGAS,
    },
  );
};

/**
 * Admin update round payout Challenge
 */
export const chefSetPayouts = (args: { potId: string; payouts: Payout[] }) =>
  contractApi(args.potId).call<typeof args, Payout[]>("chef_set_payouts", {
    args,
    deposit: "1",
    gas: FULL_TGAS,
  });

/**
 * Admin process payout
 */
export const adminProcessPayouts = (args: { potId: string }) =>
  contractApi(args.potId).call<typeof args, Payout[]>("admin_process_payouts", {
    args,
    deposit: "1",
    gas: FULL_TGAS,
  });

export const donate = (
  potAccountId: PotId,
  args: PotDonationArgs,
  depositAmountYocto: string,
) =>
  contractApi(potAccountId).call<typeof args, PotDonation>("donate", {
    args,
    deposit: depositAmountYocto,
    callbackUrl: window.location.href,
  });

export const donateBatch = (
  potAccountId: PotId,
  txDrafts: PotBatchDonationItem[],
) =>
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
