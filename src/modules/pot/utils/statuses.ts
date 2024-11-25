import { Pot } from "@/common/api/indexer";
import { getDateTime } from "@/modules/core";

export type PotTimelineParams = Pot & {
  isVotingEnabled: boolean;
};

export const potIndexedDataByIdToStatuses = ({
  isVotingEnabled,
  application_start,
  application_end,
  matching_round_start,
  matching_round_end,
  cooldown_end,
  all_paid_out,
}: PotTimelineParams) => {
  const date = new Date();
  const now = date.getTime();
  const application_start_ms = getDateTime(application_start);
  const application_end_ms = getDateTime(application_end);
  const public_round_start_ms = getDateTime(matching_round_start);
  const public_round_end_ms = getDateTime(matching_round_end);
  const cooldown_end_ms = cooldown_end ? getDateTime(cooldown_end) : null;

  return [
    {
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
      label: isVotingEnabled ? "Voting period" : "Matching round",
      daysLeft: public_round_end_ms,
      started: now >= public_round_start_ms,
      completed: now > public_round_end_ms,

      progress:
        now > public_round_end_ms
          ? 1
          : (now - public_round_start_ms) / (public_round_end_ms - public_round_start_ms),
    },

    {
      label: "Challenge period",
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
      label: "Payouts completed",
      daysLeft: null,
      started: null,
      completed: all_paid_out,
      progress: all_paid_out ? 1 : 0,
    },
  ];
};
