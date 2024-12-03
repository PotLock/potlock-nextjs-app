import { useMemo } from "react";

import { ByPotId, indexer } from "@/common/api/indexer";
import { getDateTime } from "@/entities/core";

import { PotLifecycleStageTagEnum } from "../types";

export type PotLifecycleCalculationInputs = ByPotId & { hasVoting?: boolean };

export const usePotLifecycle = ({ potId, hasVoting }: PotLifecycleCalculationInputs) => {
  const { data: pot } = indexer.usePot({ potId });

  const date = new Date();
  const now = date.getTime();

  const stages = useMemo(() => {
    if (pot) {
      const application_start_ms = getDateTime(pot.application_start);
      const application_end_ms = getDateTime(pot.application_end);
      const public_round_start_ms = getDateTime(pot.matching_round_start);
      const public_round_end_ms = getDateTime(pot.matching_round_end);
      const cooldown_end_ms = pot.cooldown_end ? getDateTime(pot.cooldown_end) : null;

      return [
        {
          tag: PotLifecycleStageTagEnum.Application,
          label: "Applications round",
          daysLeft: application_end_ms,
          started: now >= application_start_ms,
          completed: now > application_end_ms,

          progress:
            now > application_end_ms
              ? 1
              : (now - application_start_ms) / (application_end_ms - application_start_ms),
        },

        {
          tag: PotLifecycleStageTagEnum.Matching,
          label: `${hasVoting ? "Voting" : "Matching"} round`,
          daysLeft: public_round_end_ms,
          started: now >= public_round_start_ms,
          completed: now > public_round_end_ms,

          progress:
            now > public_round_end_ms
              ? 1
              : (now - public_round_start_ms) / (public_round_end_ms - public_round_start_ms),
        },

        {
          tag: PotLifecycleStageTagEnum.Cooldown,
          label: "Cooldown period",
          daysLeft: cooldown_end_ms,
          started: now >= public_round_end_ms,
          completed: cooldown_end_ms ? now > cooldown_end_ms && !!cooldown_end_ms : false,

          progress: cooldown_end_ms
            ? now > cooldown_end_ms && !!cooldown_end_ms
              ? 1
              : (cooldown_end_ms - now) / (public_round_end_ms - cooldown_end_ms)
            : 0,
        },

        {
          tag: PotLifecycleStageTagEnum.Completed,
          label: "Payouts completed",
          daysLeft: null,
          started: null,
          completed: pot.all_paid_out,
          progress: pot.all_paid_out ? 1 : 0,
        },
      ];
    } else return [];
  }, [hasVoting, now, pot]);

  const currentStage = useMemo(
    () => stages.find((stage) => stage.started && !stage.completed),
    [stages],
  );

  return { stages, currentStage };
};
