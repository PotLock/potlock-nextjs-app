import { Pot } from "@/common/api/indexer";

const currentDate = Date.now();

export const filters: Record<string, (round: Pot) => boolean> = {
  // application_not_started: (round: Pot) =>
  //   currentDate < new Date(round.application_start).getTime(),
  application_open: (round: Pot) =>
    currentDate > new Date(round.application_start).getTime() &&
    currentDate < new Date(round.application_end).getTime(),
  application_closed: (round: Pot) =>
    currentDate > new Date(round.application_end).getTime(),
  // round_end: (round: Pot) =>
  //   currentDate > new Date(round.matching_round_end).getTime(),
  round_open: (round: Pot) =>
    currentDate > new Date(round.matching_round_start).getTime() &&
    currentDate < new Date(round.matching_round_end).getTime(),
  cooldown: (round: Pot) =>
    !round.cooldown_end
      ? true
      : currentDate > new Date(round.matching_round_end).getTime() &&
        currentDate < new Date(round.cooldown_end).getTime(),
  // completed: (round: Pot) => round.all_paid_out,
};
