import { useEffect, useMemo, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Temporal } from "temporal-polyfill";

import { ByPotId, indexer } from "@/common/api/indexer";
import { Challenge, potContractClient } from "@/common/contracts/core";
import { isAccountId } from "@/common/lib";
import type { ByAccountId } from "@/common/types";

/**
 * @deprecated Use {@link Temporal} API instead
 */
const getDateTime = (date: string) => new Date(date).getTime();

// TODO: Apply performance optimizations
/**
 * Pot authorization for a specific user.
 */
export const usePotAuthorization = ({ potId, accountId }: ByPotId & Partial<ByAccountId>) => {
  const now = Date.now();
  const isValidAccountId = isAccountId(accountId);
  const { data: pot } = indexer.usePot({ potId });
  const { data: potApplications } = indexer.usePotApplications({ potId, page_size: 999 });

  const [payoutsChallenges, setPayoutsChallenges] = useState<Challenge[] | null | undefined>(
    undefined,
  );

  // TODO: create and use a wrapper hook instead
  useEffect(() => {
    if (payoutsChallenges === undefined) {
      potContractClient
        .get_payouts_challenges({ potId })
        .then(setPayoutsChallenges)
        .catch((error) => {
          setPayoutsChallenges(null);
          console.error(error);
        });
    }
  }, [payoutsChallenges, pot, potId]);

  const isApplicant = useMemo(
    () => accountId && potApplications?.results.find(({ applicant }) => applicant.id === accountId),

    [accountId, potApplications],
  );

  const publicRoundOpen = useMemo(
    () =>
      pot &&
      now >= getDateTime(pot.matching_round_start) &&
      now < getDateTime(pot.matching_round_end),

    [pot, now],
  );

  const isOwner = useMemo(
    () => isValidAccountId && pot && pot.owner.id === accountId,
    [accountId, isValidAccountId, pot],
  );

  const isAdmin = useMemo(
    () =>
      isValidAccountId &&
      pot &&
      pot.admins.find(({ id: adminAccountId }) => adminAccountId === accountId),

    [accountId, isValidAccountId, pot],
  );

  const isChef = useMemo(
    () => isValidAccountId && pot && pot.chef.id === accountId,
    [accountId, isValidAccountId, pot],
  );

  const isAdminOrGreater = useMemo(() => isAdmin || isOwner, [isAdmin, isOwner]);
  const isChefOrGreater = useMemo(() => isChef || isAdminOrGreater, [isChef, isAdminOrGreater]);

  const isApplicationPeriodOngoing = useMemo(
    () =>
      pot && now >= getDateTime(pot.application_start) && now < getDateTime(pot.application_end),

    [pot, now],
  );

  const canFund = useMemo(
    () => isValidAccountId && pot && now < getDateTime(pot.matching_round_end),
    [isValidAccountId, pot, now],
  );

  const canDonate = useMemo(
    () => isValidAccountId && publicRoundOpen,
    [isValidAccountId, publicRoundOpen],
  );

  const canApply = useMemo(
    () => isValidAccountId && isApplicationPeriodOngoing && !isApplicant && !isChefOrGreater,
    [isValidAccountId, isApplicationPeriodOngoing, isApplicant, isChefOrGreater],
  );

  const canChallengePayouts = useMemo(
    () =>
      isValidAccountId &&
      pot &&
      (pot.cooldown_end
        ? now > getDateTime(pot.matching_round_end) && now < getDateTime(pot.cooldown_end)
        : false),

    [isValidAccountId, pot, now],
  );

  const activeChallenge = useMemo(
    () => payoutsChallenges?.find((challenge) => challenge.challenger_id === accountId),
    [payoutsChallenges, accountId],
  );

  return {
    isAdmin,
    isAdminOrGreater,
    isChef,
    isChefOrGreater,
    isOwner,
    canDonate,
    canFund,
    canApply,
    canChallengePayouts,
    activeChallenge,
  };
};
