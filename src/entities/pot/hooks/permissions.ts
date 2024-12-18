import { useEffect, useMemo, useState } from "react";

import { ByPotId, indexer } from "@/common/api/indexer";
import { Application, Challenge, potClient } from "@/common/contracts/core";
import { authHooks } from "@/common/services/auth";
import { getDateTime } from "@/entities/core";

export const usePotBasicUserPermissions = ({ potId }: ByPotId) => {
  const { isSignedIn, accountId } = authHooks.useUserSession();
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

      potClient.getPayoutsChallenges({ potId }).then(setPayoutsChallenges).catch(console.error);
    }
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
