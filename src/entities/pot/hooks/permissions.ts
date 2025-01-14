import { useEffect, useMemo, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Temporal } from "temporal-polyfill";

import { ByPotId, indexer } from "@/common/api/indexer";
import { Challenge, potContractClient } from "@/common/contracts/core";
import { useSession } from "@/entities/_shared/session";

/**
 * @deprecated Use {@link Temporal} API instead
 */
const getDateTime = (date: string) => new Date(date).getTime();

export const usePotBasicUserPermissions = ({ potId }: ByPotId) => {
  const now = Date.now();
  const authenticatedUser = useSession();
  const { data: pot } = indexer.usePot({ potId });
  const { data: potApplications } = indexer.usePotApplications({ potId, page_size: 999 });

  // TODO: cover the required endpoints and throw this away
  const [payoutsChallenges, setPayoutsChallenges] = useState<Challenge[]>([]);

  // TODO: cover the required endpoints and throw this away
  useEffect(() => {
    if (authenticatedUser.isSignedIn) {
      potContractClient
        .getPayoutsChallenges({ potId })
        .then(setPayoutsChallenges)
        .catch(console.error);
    }
  }, [authenticatedUser.isSignedIn, pot, potId]);

  const isApplicant = useMemo(
    () =>
      authenticatedUser.accountId &&
      potApplications?.results.find(
        ({ applicant }) => applicant.id === authenticatedUser.accountId,
      ),

    [authenticatedUser.accountId, potApplications],
  );

  const publicRoundOpen = useMemo(
    () =>
      pot &&
      now >= getDateTime(pot.matching_round_start) &&
      now < getDateTime(pot.matching_round_end),

    [pot, now],
  );

  const isOwner = useMemo(
    () => authenticatedUser.isSignedIn && pot && pot.owner.id === authenticatedUser.accountId,
    [authenticatedUser.isSignedIn, authenticatedUser.accountId, pot],
  );

  const administratedListsOnly = useMemo(
    () =>
      authenticatedUser.isSignedIn &&
      pot &&
      pot.admins.find(({ id: adminAccountId }) => adminAccountId === authenticatedUser.accountId),

    [authenticatedUser.isSignedIn, authenticatedUser.accountId, pot],
  );

  const isChef = useMemo(
    () => authenticatedUser.isSignedIn && pot && pot.chef.id === authenticatedUser.accountId,
    [authenticatedUser.isSignedIn, authenticatedUser.accountId, pot],
  );

  const isAdminOrGreater = useMemo(() => administratedListsOnly || isOwner, [administratedListsOnly, isOwner]);
  const isChefOrGreater = useMemo(() => isChef || isAdminOrGreater, [isChef, isAdminOrGreater]);

  const isApplicationPeriodOngoing = useMemo(
    () =>
      pot && now >= getDateTime(pot.application_start) && now < getDateTime(pot.application_end),

    [pot, now],
  );

  const canFund = useMemo(() => pot && now < getDateTime(pot.matching_round_end), [pot, now]);

  const canDonate = useMemo(
    () => authenticatedUser.isSignedIn && publicRoundOpen,
    [publicRoundOpen, authenticatedUser.isSignedIn],
  );

  const canApply = useMemo(
    () =>
      authenticatedUser.isSignedIn &&
      isApplicationPeriodOngoing &&
      !isApplicant &&
      !isChefOrGreater,

    [isApplicationPeriodOngoing, authenticatedUser.isSignedIn, isApplicant, isChefOrGreater],
  );

  const canChallengePayouts = useMemo(
    () =>
      authenticatedUser.isSignedIn &&
      pot &&
      (pot.cooldown_end
        ? now > getDateTime(pot.matching_round_end) && now < getDateTime(pot.cooldown_end)
        : false),

    [authenticatedUser.isSignedIn, pot, now],
  );

  const existingChallengeForUser = useMemo(
    () =>
      payoutsChallenges.find(
        (challenge) => challenge.challenger_id === authenticatedUser.accountId,
      ),

    [payoutsChallenges, authenticatedUser.accountId],
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
