import { useMemo } from "react";

import { prop } from "remeda";

import { useIsHuman } from "@/common/_deprecated/useIsHuman";
import { ClearanceCheckResult } from "@/common/types";
import { useSession } from "@/entities/_shared/session";

// TODO: refactor to support multi-mechanism for the V2 milestone
/**
 * Heads up! At the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 */
export const useVotingRoundSessionClearance = (): ClearanceCheckResult => {
  const { accountId, hasRegistrationApproved } = useSession();
  const { isHumanVerified: isHuman } = useIsHuman(accountId);

  return useMemo(() => {
    const requirements = [
      { title: "Must have an account on POTLOCK.", isSatisfied: hasRegistrationApproved },
      { title: "Must have human verification.", isSatisfied: isHuman },
    ];

    return {
      requirements,
      isEveryRequirementSatisfied: requirements.every(prop("isSatisfied")),
      error: null,
    };
  }, [isHuman, hasRegistrationApproved]);
};
