import { useEffect, useMemo, useState } from "react";

import { prop } from "remeda";

import { METAPOOL_LIQUID_STAKING_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { ByPotId, indexer } from "@/common/api/indexer";
import { Application, Challenge, potClient } from "@/common/contracts/core";
import { METAPOOL_MPDAO_VOTING_POWER_DECIMALS } from "@/common/contracts/metapool";
import { u128StringToBigNum } from "@/common/lib";
import { ftService } from "@/common/services";
import { AccessControlClearanceCheckResult } from "@/modules/access-control";
import { useAuthSession } from "@/modules/auth";
import { getDateTime, useIsHuman } from "@/modules/core";

import { isPotVotingBased } from "../utils/voting";

export const usePotUserPermissions = ({ potId }: ByPotId) => {
  const { isSignedIn, accountId } = useAuthSession();
  const { data: pot } = indexer.usePot({ potId });
  const now = Date.now();

  const [existingApplication, setExistingApplication] = useState<Application | undefined>();
  const [payoutsChallenges, setPayoutsChallenges] = useState<Challenge[]>([]);

  // INFO: Using this because the Indexer service doesn't provide these APIs
  // TODO: Request and cover the required endpoints and throw this away
  useEffect(() => {
    if (isSignedIn) {
      potClient
        // Check if current account has a existing application
        .getApplicationByProjectId({ potId, project_id: accountId })
        .then(setExistingApplication)
        .catch(() => setExistingApplication(undefined));
    }

    potClient.getPayoutsChallenges({ potId }).then(setPayoutsChallenges).catch(console.error);
  }, [accountId, isSignedIn, pot, potId]);

  const publicRoundOpen = useMemo(
    () =>
      pot &&
      now >= getDateTime(pot.matching_round_start) &&
      now < getDateTime(pot.matching_round_end),

    [pot, now],
  );

  const canDonate = useMemo(() => publicRoundOpen && accountId, [publicRoundOpen, accountId]);
  const canFund = useMemo(() => pot && now < getDateTime(pot.matching_round_end), [pot, now]);

  const isAdminOrGreater = useMemo(
    () =>
      pot?.admins.find(({ id: adminAccountId }) => adminAccountId === accountId) ||
      pot?.owner.id === accountId,

    [pot, accountId],
  );

  const isChefOrGreater = useMemo(
    () => isAdminOrGreater || pot?.chef?.id === accountId,
    [isAdminOrGreater, pot, accountId],
  );

  const applicationOpen = useMemo(
    () =>
      pot && now >= getDateTime(pot.application_start) && now < getDateTime(pot.application_end),

    [pot, now],
  );

  const canApply = useMemo(
    () => applicationOpen && existingApplication === undefined && !isChefOrGreater,
    [applicationOpen, existingApplication, isChefOrGreater],
  );

  const canChallengePayouts = useMemo(
    () =>
      pot?.cooldown_end
        ? now > getDateTime(pot.matching_round_end) && now < getDateTime(pot.cooldown_end)
        : false,

    [pot, now],
  );

  const existingChallengeForUser = useMemo(
    () => payoutsChallenges.find((challenge) => challenge.challenger_id === accountId),
    [payoutsChallenges, accountId],
  );

  return {
    publicRoundOpen,
    canDonate,
    canFund,
    canApply,
    canChallengePayouts,
    /**
     * Is there a existing challenge created by this user/dao?
     */
    existingChallengeForUser,
  };
};

// TODO: refactor to support multi-mechanism for the V2 milestone
/**
 * Heads up! At the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 */
export const usePotUserApplicationClearance = ({
  potId,
}: ByPotId): AccessControlClearanceCheckResult => {
  const { accountId: _, isAccountInfoLoading, isVerifiedPublicGoodsProvider } = useAuthSession();

  const isVotingBasedPot = isPotVotingBased({ potId });

  const { data: stNear } = ftService.useRegisteredToken({
    tokenId: METAPOOL_LIQUID_STAKING_CONTRACT_ACCOUNT_ID,
  });

  // TODO: Get voting power from the snapshot endpoint's real data
  // TODO: Get voting power from the snapshot GH gist
  const votingPowerU128StringMock = "0";

  return useMemo(() => {
    const requirements = [
      {
        title: "Verified Project on Potlock",
        isFulfillmentAssessmentPending: isAccountInfoLoading,
        isSatisfied: isVerifiedPublicGoodsProvider,
      },

      ...(isVotingBasedPot
        ? [
            {
              title: "An equivalent of 25 USD staked in NEAR on Meta Pool",
              isSatisfied: stNear?.balanceUsd?.gte(25) ?? false,
            },

            {
              title: "Voting power 5000 or more",
              hasFulfillmentAssessmentInputs: false,

              isSatisfied: u128StringToBigNum(
                votingPowerU128StringMock,
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
  }, [isAccountInfoLoading, isVerifiedPublicGoodsProvider, isVotingBasedPot, stNear?.balanceUsd]);
};

// TODO: refactor to support multi-mechanism for the V2 milestone
/**
 * Heads up! At the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 */
export const usePotUserVotingClearance = ({
  potId,
}: ByPotId): AccessControlClearanceCheckResult => {
  const { accountId, isVerifiedPublicGoodsProvider } = useAuthSession();
  const { nadaBotVerified: isHuman } = useIsHuman(accountId);
  const isVotingBasedPot = isPotVotingBased({ potId });

  return useMemo(() => {
    if (!isVotingBasedPot) {
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
  }, [isHuman, isVerifiedPublicGoodsProvider, isVotingBasedPot]);
};
