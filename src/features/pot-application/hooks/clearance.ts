import { useMemo } from "react";

import { prop } from "remeda";

import { PLATFORM_NAME } from "@/common/_config";
import { ByPotId, indexer } from "@/common/api/indexer";
import { METAPOOL_MPDAO_VOTING_POWER_DECIMALS } from "@/common/contracts/metapool";
import { indivisibleUnitsToBigNum } from "@/common/lib";
import { type AccountId, ClearanceCheckResult } from "@/common/types";
import { useSession } from "@/entities/_shared/session";
import { useToken } from "@/entities/_shared/token";

import { POT_APPLICATION_REQUIREMENTS_MPDAO } from "../constants";

// TODO: refactor to support multi-mechanism for the V2 milestone
/**
 * Heads up! At the moment, this hook only covers one specific voting round,
 *  as it's built for the mpDAO milestone.
 */
export const usePotApplicationUserClearance = ({
  potId,
  hasProportionalFundingMechanism,
}: ByPotId & { hasProportionalFundingMechanism?: boolean }): ClearanceCheckResult => {
  const { staking } = POT_APPLICATION_REQUIREMENTS_MPDAO;
  const { data: pot } = indexer.usePot({ potId });

  const authenticatedUser = useSession();

  const { data: voterInfo } = indexer.useMpdaoVoter({
    enabled: authenticatedUser.isSignedIn,
    accountId: authenticatedUser.accountId as AccountId,
  });

  const { data: stakingToken } = useToken({
    balanceCheckAccountId: authenticatedUser.accountId,
    tokenId: staking.tokenId,
  });

  return useMemo(() => {
    const requirements = [
      ...(pot?.sybil_wrapper_provider === "string"
        ? [
            {
              title: `Verified Project on ${PLATFORM_NAME}`,
              isFulfillmentAssessmentPending: authenticatedUser.isMetadataLoading,
              isSatisfied: authenticatedUser.hasRegistrationApproved,
            },
          ]
        : []),

      ...(hasProportionalFundingMechanism
        ? [
            {
              title: `An equivalent of ${staking.minAmountUsd} USD staked in NEAR on ${staking.platformName}`,
              isSatisfied: stakingToken?.balanceUsd?.gte(staking.minAmountUsd) ?? false,
            },

            {
              title: "Voting power 5000 or more",

              isSatisfied: indivisibleUnitsToBigNum(
                voterInfo?.voter_data.voting_power ?? "0",
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
    authenticatedUser.isMetadataLoading,
    authenticatedUser.hasRegistrationApproved,
    hasProportionalFundingMechanism,
    pot?.sybil_wrapper_provider,
    staking.minAmountUsd,
    staking.platformName,
    stakingToken?.balanceUsd,
    voterInfo?.voter_data.voting_power,
  ]);
};
