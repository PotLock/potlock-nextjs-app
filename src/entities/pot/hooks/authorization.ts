import { useMemo } from "react";

import { ByPotId } from "@/common/api/indexer";
import { IS_UNDER_INSPECTION } from "@/common/constants";
import { potContractHooks } from "@/common/contracts/core";
import { isAccountId } from "@/common/lib";
import type { ByAccountId } from "@/common/types";

/**
 * Pot authorization for a specific user.
 */
export const usePotAuthorization = ({ potId, accountId }: ByPotId & Partial<ByAccountId>) => {
  const now = Date.now();
  const isValidAccountId = useMemo(() => isAccountId(accountId), [accountId]);
  const { data: potConfig } = potContractHooks.useConfig({ potId });
  const { data: potPayouts } = potContractHooks.usePayouts({ potId });
  const { data: potPayoutChallenges } = potContractHooks.usePayoutChallenges({ potId });
  const { data: potApplications } = potContractHooks.useApplications({ potId });

  const isApplicationPeriodOngoing = useMemo(
    () => potConfig && now >= potConfig.application_start_ms && now < potConfig.application_end_ms,
    [potConfig, now],
  );

  const isPublicRoundOngoing = useMemo(
    () =>
      potConfig && now >= potConfig.public_round_start_ms && now < potConfig.public_round_end_ms,

    [potConfig, now],
  );

  // TODO: Needs to be reconsidered
  const isCooldownPeriodOngoing = useMemo(
    () =>
      potConfig &&
      (potConfig.cooldown_end_ms
        ? now > potConfig.public_round_end_ms && now < potConfig.cooldown_end_ms
        : now > potConfig.public_round_end_ms && !potConfig.all_paid_out),

    [now, potConfig],
  );

  const isSubmittedPayoutListEmpty = potPayouts?.length === 0;

  const isApplicant = useMemo(
    () => isValidAccountId && potApplications?.find(({ project_id }) => project_id === accountId),
    [accountId, isValidAccountId, potApplications],
  );

  const isOwner = useMemo(
    () => IS_UNDER_INSPECTION || (isValidAccountId && potConfig && accountId && potConfig.owner),
    [accountId, isValidAccountId, potConfig],
  );

  const isAdmin = useMemo(
    () =>
      IS_UNDER_INSPECTION ||
      (isValidAccountId &&
        potConfig &&
        potConfig.admins.find((adminAccountId) => accountId === adminAccountId)),

    [accountId, isValidAccountId, potConfig],
  );

  const isChef = useMemo(
    () => IS_UNDER_INSPECTION || (isValidAccountId && potConfig && accountId === potConfig.chef),
    [accountId, isValidAccountId, potConfig],
  );

  const isAdminOrGreater = useMemo(() => isAdmin || isOwner, [isAdmin, isOwner]);
  const isChefOrGreater = useMemo(() => isChef || isAdminOrGreater, [isChef, isAdminOrGreater]);

  const canFundMatchingPool = useMemo(
    () => isValidAccountId && potConfig && now < potConfig.public_round_end_ms,
    [isValidAccountId, potConfig, now],
  );

  const canDonate = useMemo(
    () => isValidAccountId && isPublicRoundOngoing,
    [isValidAccountId, isPublicRoundOngoing],
  );

  const canApply = useMemo(
    () => isApplicationPeriodOngoing && isValidAccountId && !isApplicant && !isChefOrGreater,
    [isValidAccountId, isApplicationPeriodOngoing, isApplicant, isChefOrGreater],
  );

  const canSubmitPayouts = useMemo(
    () => isChefOrGreater && isCooldownPeriodOngoing && isSubmittedPayoutListEmpty,
    [isChefOrGreater, isSubmittedPayoutListEmpty, isCooldownPeriodOngoing],
  );

  // TODO: Include consideration of payout challenges
  const canInitiatePayoutProcessing = useMemo(
    () => isAdminOrGreater && isCooldownPeriodOngoing && potConfig?.all_paid_out,
    [isAdminOrGreater, isCooldownPeriodOngoing, potConfig],
  );

  const canChallengePayouts = useMemo(
    () => isValidAccountId && potConfig && isCooldownPeriodOngoing && !isSubmittedPayoutListEmpty,
    [isValidAccountId, potConfig, isCooldownPeriodOngoing, isSubmittedPayoutListEmpty],
  );

  const activeChallenge = useMemo(
    () => potPayoutChallenges?.find((challenge) => challenge.challenger_id === accountId),
    [potPayoutChallenges, accountId],
  );

  return {
    isAdmin,
    isAdminOrGreater,
    isChef,
    isChefOrGreater,
    isOwner,
    canApply,
    canChallengePayouts,
    canDonate,
    canFundMatchingPool,
    canInitiatePayoutProcessing,
    canSubmitPayouts,
    // TODO: Move elsewhere as it's out of the scope of this hook
    activeChallenge,
  };
};
