import { useMemo } from "react";

// TODO: Use Temporal API for datetime computations
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Temporal } from "temporal-polyfill";

import { ByPotId, indexer } from "@/common/api/indexer";
import daysUntil from "@/common/lib/daysUntil";

import { usePotFeatureFlags } from "./feature-flags";

export const usePotTags = ({ potId }: ByPotId) => {
  const { data: pot } = indexer.usePot({ potId });
  const { hasPFMechanism } = usePotFeatureFlags({ potId });

  return useMemo(() => {
    if (pot) {
      const applicationStartMs = new Date(pot.application_start).getTime();
      const applicationEndMs = new Date(pot.application_end).getTime();
      const publicRoundStartMs = new Date(pot.matching_round_start).getTime();
      const publicRoundEndMs = new Date(pot.matching_round_end).getTime();
      const cooldownEndMs = pot.cooldown_end ? new Date(pot.cooldown_end).getTime() : null;

      // TODO: Use Temporal API for datetime computations
      const now = Date.now();
      const applicationOpen = now >= applicationStartMs && now < applicationEndMs;
      const publicRoundOpen = now >= publicRoundStartMs && now < publicRoundEndMs;
      const cooldownPending = publicRoundEndMs && now >= publicRoundEndMs && !cooldownEndMs;
      const cooldownOpen = Boolean(cooldownEndMs && now >= publicRoundEndMs && now < cooldownEndMs);
      const payoutsPending = Boolean(cooldownEndMs && now >= cooldownEndMs && !pot.all_paid_out);
      const payoutsCompleted = pot.all_paid_out;

      return [
        /* Application's has not started tag */
        {
          backgroundColor: "#EFFEFA",
          borderColor: "#33DDCB",
          textColor: "#023131",
          text: "Sponsorship Open",
          preElementsProps: { colorOuter: "#CAFDF3", colorInner: "#33DDCB", animate: true },
          visibility: now < applicationStartMs,
        },
        /* Application tag */
        {
          backgroundColor: "#EFFEFA",
          borderColor: "#33DDCB",
          textColor: "#023131",
          text: daysUntil(applicationEndMs) + " left to apply",
          preElementsProps: { colorOuter: "#CAFDF3", colorInner: "#33DDCB", animate: true },
          visibility: applicationOpen,
        },
        /* Matching round open tag */
        {
          backgroundColor: "#F7FDE8",
          borderColor: "#9ADD33",
          textColor: "#192C07",
          text: `${daysUntil(publicRoundEndMs)} left to ${hasPFMechanism ? "vote" : "donate"}`,
          preElementsProps: { colorOuter: "#D7F5A1", colorInner: "#9ADD33", animate: true },
          visibility: publicRoundOpen,
        },
        /* Cooldown pending tag */
        {
          backgroundColor: "#F5F3FF",
          borderColor: "#A68AFB",
          textColor: "#2E0F66",
          text: "Cooldown pending",
          preElementsProps: { colorOuter: "#EDE9FE", colorInner: "#A68AFB", animate: true },
          visibility: cooldownPending,
        },
        /* Matching round cooldown tag */
        {
          backgroundColor: "#F5F3FF",
          borderColor: "#A68AFB",
          textColor: "#2E0F66",
          text: "Challenge period",
          preElementsProps: { colorOuter: "#EDE9FE", colorInner: "#A68AFB", animate: true },
          visibility: cooldownOpen,
        },
        /* Payouts pending tag */
        {
          backgroundColor: "#F7FDE8",
          borderColor: "#9ADD33",
          textColor: "#192C07",
          text: "Payouts pending",
          preElementsProps: { colorOuter: "#D7F5A1", colorInner: "#9ADD33", animate: true },
          visibility: payoutsPending,
        },
        /* Matching round closed tag */
        {
          backgroundColor: "#464646",
          borderColor: "#292929",
          textColor: "#FFF",
          text: "Payouts completed",
          preElementsProps: { colorOuter: "#656565", colorInner: "#A6A6A6", animate: false },
          visibility: payoutsCompleted,
        },
      ];
    } else return [];
  }, [hasPFMechanism, pot]);
};
