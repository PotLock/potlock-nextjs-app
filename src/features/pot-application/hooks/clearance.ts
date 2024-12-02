// TODO: refactor to support multi-mechanism for the V2 milestone

import { useMemo } from "react";

import { prop } from "remeda";

import { METAPOOL_LIQUID_STAKING_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { ByPotId, indexer } from "@/common/api/indexer";
import { METAPOOL_MPDAO_VOTING_POWER_DECIMALS } from "@/common/contracts/metapool";
import { u128StringToBigNum } from "@/common/lib";
import { ftService } from "@/common/services";
import { ClearanceCheckResult } from "@/common/types";
import { useAuthSession } from "@/modules/session";

/**
 * Heads up! At the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 */
export const usePotApplicationUserClearance = ({
  potId: _,
  hasVoting,
}: ByPotId & { hasVoting?: boolean }): ClearanceCheckResult => {
  const { accountId, isAccountInfoLoading, isVerifiedPublicGoodsProvider } = useAuthSession();

  const { data: stNear } = ftService.useRegisteredToken({
    tokenId: METAPOOL_LIQUID_STAKING_CONTRACT_ACCOUNT_ID,
  });

  const { data: voterInfo } = indexer.useMpdaoVoterInfo({ accountId });

  return useMemo(() => {
    const requirements = [
      {
        title: "Verified Project on Potlock",
        isFulfillmentAssessmentPending: isAccountInfoLoading,
        isSatisfied: isVerifiedPublicGoodsProvider,
      },

      ...(hasVoting
        ? [
            {
              title: "An equivalent of 25 USD staked in NEAR on Meta Pool",
              isSatisfied: stNear?.balanceUsd?.gte(25) ?? false,
            },

            {
              title: "Voting power 5000 or more",

              isSatisfied: u128StringToBigNum(
                voterInfo?.voting_power ?? "0",
                METAPOOL_MPDAO_VOTING_POWER_DECIMALS,
              ).gte(5000),
            },
          ]
        : []),
    ];

    return {
      requirements,
      isEveryRequirementSatisfied: requirements.every(prop("isSatisfied")),
      error: null,
    };
  }, [
    hasVoting,
    isAccountInfoLoading,
    isVerifiedPublicGoodsProvider,
    stNear?.balanceUsd,
    voterInfo?.voting_power,
  ]);
};
