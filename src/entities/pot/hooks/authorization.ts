import { useMemo } from "react";

import { ByPotId } from "@/common/api/indexer";
import { ApplicationStatus, potContractHooks } from "@/common/contracts/core/pot";
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

  // TODO: Relocate to `usePotLifecycle`
  const isApplicationPeriodOngoing = useMemo(
    () => potConfig && now >= potConfig.application_start_ms && now < potConfig.application_end_ms,
    [potConfig, now],
  );

  // TODO: Relocate to `usePotLifecycle`
  const isPublicRoundOngoing = useMemo(
    () =>
      potConfig && now >= potConfig.public_round_start_ms && now < potConfig.public_round_end_ms,

    [potConfig, now],
  );

  // TODO: Relocate to `usePotLifecycle`
  const isCooldownPeriodOngoing = useMemo(
    () =>
      potConfig &&
      (potConfig.cooldown_end_ms
        ? now > potConfig.public_round_end_ms && now < potConfig.cooldown_end_ms
        : false),

    [now, potConfig],
  );

  // TODO: Relocate to `usePotLifecycle`
  const isSubmittedPayoutListEmpty = potPayouts?.length === 0;

  const isApplicant = useMemo(
    () =>
      isValidAccountId &&
      potApplications?.find(({ project_id }) => project_id === accountId) !== undefined,

    [accountId, isValidAccountId, potApplications],
  );

  const isOwner = useMemo(
    () => isValidAccountId && potConfig && accountId === potConfig.owner,
    [accountId, isValidAccountId, potConfig],
  );

  const isAdmin = useMemo(
    () =>
      isValidAccountId &&
      potConfig &&
      potConfig.admins.find((adminAccountId) => accountId === adminAccountId),

    [accountId, isValidAccountId, potConfig],
  );

  const isChef = useMemo(
    () => isValidAccountId && potConfig && accountId === potConfig.chef,
    [accountId, isValidAccountId, potConfig],
  );

  const isAdminOrGreater = useMemo(() => isAdmin || isOwner, [isAdmin, isOwner]);
  const isChefOrGreater = useMemo(() => isChef || isAdminOrGreater, [isChef, isAdminOrGreater]);

  const canFundMatchingPool = useMemo(
    () => isValidAccountId && potConfig && now < potConfig.public_round_end_ms,
    [isValidAccountId, potConfig, now],
  );

  const canDonate = useMemo(
    () =>
      isValidAccountId &&
      isPublicRoundOngoing &&
      potApplications?.find(({ status }) => status === ApplicationStatus.Approved) !== undefined,
    [isValidAccountId, isPublicRoundOngoing, potApplications],
  );

  const canApply = useMemo(
    () => isApplicationPeriodOngoing && isValidAccountId && !isApplicant && !isChefOrGreater,
    [isValidAccountId, isApplicationPeriodOngoing, isApplicant, isChefOrGreater],
  );

  const canSubmitPayouts = useMemo(
    () =>
      isChefOrGreater &&
      isSubmittedPayoutListEmpty &&
      potConfig &&
      potConfig.public_round_end_ms < now,

    [isChefOrGreater, isSubmittedPayoutListEmpty, now, potConfig],
  );

  // TODO: Make sure all payout challenges are resolved
  const canInitiatePayoutProcessing = useMemo(
    () =>
      isAdminOrGreater &&
      !isSubmittedPayoutListEmpty &&
      (potConfig?.cooldown_end_ms === undefined ? true : !isCooldownPeriodOngoing) &&
      !potConfig?.all_paid_out,

    [
      isAdminOrGreater,
      isCooldownPeriodOngoing,
      isSubmittedPayoutListEmpty,
      potConfig?.all_paid_out,
      potConfig?.cooldown_end_ms,
    ],
  );

  const canChallengePayouts = useMemo(
    () => isValidAccountId && isCooldownPeriodOngoing && !isSubmittedPayoutListEmpty,
    [isValidAccountId, isCooldownPeriodOngoing, isSubmittedPayoutListEmpty],
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
  };
};
