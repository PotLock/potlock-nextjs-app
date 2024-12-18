import { useMemo } from "react";

import { prop } from "remeda";

import { ByPotId } from "@/common/api/indexer";
import { useSessionAuth } from "@/common/services/auth";
import { ClearanceCheckResult } from "@/common/types";
import { useIsHuman } from "@/entities/core";
import { usePotExtensionFlags } from "@/entities/pot";

// TODO: refactor to support multi-mechanism for the V2 milestone
/**
 * Heads up! At the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 */
export const useVotingUserClearance = ({ potId }: ByPotId): ClearanceCheckResult => {
  const { accountId, isVerifiedPublicGoodsProvider } = useSessionAuth();
  const { isHumanVerified: isHuman } = useIsHuman(accountId);
  const { hasVoting } = usePotExtensionFlags({ potId });

  return useMemo(() => {
    if (!hasVoting) {
      return {
        requirements: null,
        isEveryRequirementSatisfied: false,
        error: new Error("This pot doesn't support voting mechanisms."),
      };
    } else {
      const requirements = [
        { title: "Must have an account on Potlock.", isSatisfied: isVerifiedPublicGoodsProvider },
        { title: "Must have human verification.", isSatisfied: isHuman },
      ];

      return {
        requirements,
        isEveryRequirementSatisfied: requirements.every(prop("isSatisfied")),
        error: null,
      };
    }
  }, [isHuman, isVerifiedPublicGoodsProvider, hasVoting]);
};
