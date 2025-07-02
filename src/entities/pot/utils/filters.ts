import { Temporal } from "temporal-polyfill";

import { Pot } from "@/common/api/indexer";
import { oldToRecent } from "@/common/lib";

const currentDate = Date.now();

// Original code owner: @Jikugodwill
export const filters: Record<string, (round: Pot) => boolean> = {
  // application_not_started: (round: Pot) =>
  //   currentDate < new Date(round.application_start).getTime(),
  application_open: (round: Pot) =>
    currentDate > new Date(round.application_start).getTime() &&
    currentDate < new Date(round.application_end).getTime(),
  application_closed: (round: Pot) => currentDate > new Date(round.application_end).getTime(),
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

export const extractMatchingPots = (pots: Pot[]) =>
  oldToRecent(
    "matching_round_end",

    pots.filter(({ matching_round_start, matching_round_end }) => {
      const now = Temporal.Now.instant();

      return (
        now.since(Temporal.Instant.from(matching_round_start)).total("milliseconds") > 0 &&
        now.until(Temporal.Instant.from(matching_round_end)).total("milliseconds") > 0
      );
    }),
  );
