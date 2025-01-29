import { useMemo } from "react";

import { prop } from "remeda";

import { ClearanceCheckResult } from "@/common/types";
import { useViewerSession } from "@/common/viewer";

// TODO: refactor to support multi-mechanism for the V2 milestone
/**
 * Heads up! At the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 */
export const useVotingRoundSessionClearance = (): ClearanceCheckResult => {
  const viewer = useViewerSession();

  return useMemo(() => {
    const requirements = [
      { title: "Must have an account on POTLOCK.", isSatisfied: viewer.hasRegistrationApproved },
      { title: "Must have human verification.", isSatisfied: viewer.isHuman },
    ];

    return {
      isLoading: viewer.isMetadataLoading,
      requirements,
      isEveryRequirementSatisfied: requirements.every(prop("isSatisfied")),
      error: null,
    };
  }, [viewer.hasRegistrationApproved, viewer.isHuman, viewer.isMetadataLoading]);
};
