// TODO: refactor to support multi-mechanism for the V2 milestone

import { useMemo } from "react";

import { prop } from "remeda";

import { PLATFORM_NAME } from "@/common/_config";
import { ByPotId, indexer } from "@/common/api/indexer";
import { METAPOOL_MPDAO_VOTING_POWER_DECIMALS } from "@/common/contracts/metapool";
import { u128StringToBigNum } from "@/common/lib";
import { ftService } from "@/common/services";
import { ClearanceCheckResult } from "@/common/types";
import { useSessionAuth } from "@/entities/session";

import { POT_APPLICATION_REQUIREMENTS_MPDAO } from "../constants";

/**
 * Heads up! At the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 */
export const usePotApplicationUserClearance = ({
  potId,
  hasVoting,
}: ByPotId & { hasVoting?: boolean }): ClearanceCheckResult => {
  const { staking } = POT_APPLICATION_REQUIREMENTS_MPDAO;
  const { accountId, isAccountInfoLoading, isVerifiedPublicGoodsProvider } = useSessionAuth();
  const { data: pot } = indexer.usePot({ potId });
  const { data: stNear } = ftService.useRegisteredToken({ tokenId: staking.tokenId });
  const { data: voterInfo } = indexer.useMpdaoVoterInfo({ accountId });

  return useMemo(() => {
    const requirements = [
      ...(pot?.sybil_wrapper_provider === "string"
        ? [
            {
              title: `Verified Project on ${PLATFORM_NAME}`,
              isFulfillmentAssessmentPending: isAccountInfoLoading,
              isSatisfied: isVerifiedPublicGoodsProvider,
            },
          ]
        : []),

      ...(hasVoting
        ? [
            {
              title: `An equivalent of ${staking.minAmountUsd} USD staked in NEAR on ${staking.platformName}`,
              isSatisfied: stNear?.balanceUsd?.gte(staking.minAmountUsd) ?? false,
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

      isEveryRequirementSatisfied:
        requirements.length > 0 ? requirements.every(prop("isSatisfied")) : true,

      error: null,
    };
  }, [
    hasVoting,
    isAccountInfoLoading,
    isVerifiedPublicGoodsProvider,
    pot?.sybil_wrapper_provider,
    stNear?.balanceUsd,
    staking.minAmountUsd,
    staking.platformName,
    voterInfo?.voting_power,
  ]);
};