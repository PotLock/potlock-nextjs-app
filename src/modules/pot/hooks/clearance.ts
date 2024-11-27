// TODO: refactor the module to support multi-mechanism for the V2 milestone

import { useAuthSession } from "@/modules/auth";
import { useIsHuman } from "@/modules/core";

export type ClearanceRequirementStatus = { title: string; isSatisfied: boolean };

/**
 * WARNING: at the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 */
export const usePotApplicationUserClearance = (): ClearanceRequirementStatus[] => {
  const { accountId } = useAuthSession();

  return [
    { title: "Verified Project on Potlock", isSatisfied: true },
    { title: "A minimum stake of 500 USD in Meta Pool", isSatisfied: true },
    { title: "A minimum of 50,000 votes", isSatisfied: true },
    { title: "A total of 25 points accumulated for the RPGF score", isSatisfied: true },
  ];
};

export const usePotVotingUserClearance = (): ClearanceRequirementStatus[] => {
  const { accountId, isSignedIn } = useAuthSession();
  const { nadaBotVerified: isHuman } = useIsHuman(accountId);

  return [
    { title: "Must have an account on Potlock.", isSatisfied: isSignedIn },
    { title: "Must have human verification.", isSatisfied: isHuman },
  ];
};
