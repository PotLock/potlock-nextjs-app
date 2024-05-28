import { MemoryCache } from "@wpdas/naxios";

import {
  Application,
  ApprovedApplication,
  Challange,
  Payout,
  PotConfig,
  PotDonation,
} from "./interfaces/pot.interfaces";
import { naxiosInstance } from "..";

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
  projectId: string;
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
  projectId: string;
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
  contractApi(args.potId).view<typeof args, Challange[]>(
    "get_payouts_challenges",
    {
      args,
    },
  );

/**
 * Get round payouts
 */
export const getPayouts = async (args: { potId: string }) =>
  contractApi(args.potId).view<typeof args, Payout[]>("get_payouts ", {
    args,
  });

// WRITE METHODS
/**
 * Challange round payout
 */
export const challengePayouts = (args: { potId: string; reason: string }) => {
  const depositFloat = args.reason.length * 0.00003 + 0.003;

  contractApi(args.potId).call<typeof args, Challange[]>("challenge_payouts", {
    args,
    deposit: `${depositFloat}`,
    gas: "300000000000000",
  });
};

/**
 * Admin update round payout Challange
 */
export const adminUpdatePayoutsChallenge = (args: {
  potId: string;
  challengerId: string;
  notes: string;
  shouldResolveChallenge: boolean;
}) => {
  const depositFloat = args.notes.length * 0.00003;

  contractApi(args.potId).call<typeof args, Challange[]>(
    "admin_update_payouts_challenge",
    {
      args,
      deposit: `${depositFloat}`,
      gas: "300000000000000",
    },
  );
};

/**
 * Admin update round payout Challange
 */
export const chefSetPayouts = (args: { potId: string; payouts: Payout[] }) =>
  contractApi(args.potId).call<typeof args, Payout[]>("chef_set_payouts", {
    args,
    deposit: "1",
    gas: "300000000000000",
  });

/**
 * Admin process payout
 */
export const adminProcessPayouts = (args: { potId: string }) =>
  contractApi(args.potId).call<typeof args, Payout[]>("admin_process_payouts", {
    args,
    deposit: "1",
    gas: "300000000000000",
  });

/**
 * Get flagged acoounts for round
 */
// export const get_flagged_accounts = ({
//   potDetail,
//   potId,
// }: {
//   potDetail: PotConfig;
//   potId: string;
// }) => {
//   const roles = ["owner", "admins", "chef"];

//   const allUsers = {};
//   roles.forEach((role) => {
//     const users = potDetail[role];
//     if (typeof users === "object") {
//       users.forEach((user) => {
//         allUsers[user] = role === "admins" ? "admin" : role;
//       });
//     } else {
//       allUsers[users] = role;
//     }
//   });

//   const flaggedAccounts = [];
//   const socialKeys = Object.keys(allUsers).map((user) => `${user}/profile/**`);

//   return new Promise((resolve, reject) => {
//     getSocialProfile(socialKeys)
//       .then((profiles) => {
//         Object.entries(profiles).forEach(([user, { profile }]) => {
//           const pLBlacklistedAccounts = JSON.parse(
//             profile.pLBlacklistedAccounts || "{}",
//           );
//           const potFlaggedAcc = pLBlacklistedAccounts[potId] || {};
//           if (!isEmpty(potFlaggedAcc)) {
//             flaggedAccounts.push({
//               flaggedBy: user,
//               role: allUsers[user],
//               potFlaggedAcc,
//             });
//           }
//         });
//         resolve(flaggedAccounts);
//       })
//       .catch((error) => {
//         console.error("Error fetching social profiles:", error);
//         reject(error);
//       });
//   });
// };
