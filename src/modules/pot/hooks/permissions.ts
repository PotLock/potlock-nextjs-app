import { useEffect, useMemo, useState } from "react";

import { ByPotId, indexer } from "@/common/api/indexer";
import { Application, Challenge, potClient } from "@/common/contracts/core";
import { ByAccountId } from "@/common/types";
import { getDateTime } from "@/modules/core";

export const usePotUserPermissions = ({ potId, accountId }: ByPotId & ByAccountId) => {
  const { data: pot } = indexer.usePot({ potId });
  const now = Date.now();

  const [existingApplication, setExistingApplication] = useState<Application | undefined>();
  const [payoutsChallenges, setPayoutsChallenges] = useState<Challenge[]>([]);

  // INFO: Using this because the Indexer service doesn't provide these APIs
  // TODO: Request and cover the required endpoints and throw this away
  useEffect(() => {
    potClient
      // Check if current account has a existing application
      .getApplicationByProjectId({ potId, project_id: accountId })
      .then(setExistingApplication)
      .catch(() => setExistingApplication(undefined));

    potClient.getPayoutsChallenges({ potId }).then(setPayoutsChallenges).catch(console.error);
  }, [accountId, pot, potId]);

  const publicRoundOpen = useMemo(
    () =>
      pot &&
      now >= getDateTime(pot.matching_round_start) &&
      now < getDateTime(pot.matching_round_end),

    [pot, now],
  );

  const canDonate = useMemo(() => publicRoundOpen && accountId, [publicRoundOpen, accountId]);
  const canFund = useMemo(() => pot && now < getDateTime(pot.matching_round_end), [pot, now]);

  const userIsAdminOrGreater = useMemo(
    () => pot?.admins.find((adm) => adm.id === accountId) || pot?.owner.id === accountId,
    [pot, accountId],
  );

  const userIsChefOrGreater = useMemo(
    () => userIsAdminOrGreater || pot?.chef?.id === accountId,
    [userIsAdminOrGreater, pot, accountId],
  );

  const applicationOpen = useMemo(
    () =>
      pot && now >= getDateTime(pot.application_start) && now < getDateTime(pot.application_end),

    [pot, now],
  );

  const canApply = useMemo(
    () => applicationOpen && existingApplication === undefined && !userIsChefOrGreater,
    [applicationOpen, existingApplication, userIsChefOrGreater],
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
