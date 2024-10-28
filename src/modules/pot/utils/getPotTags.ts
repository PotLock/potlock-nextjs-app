import { Pot } from "@/common/api/indexer";
import daysUntil from "@/common/lib/daysUntil";

const getPotTags = (pot: Pot) => {
  const {
    application_start,
    application_end,
    matching_round_start,
    matching_round_end,
    cooldown_end,
    all_paid_out,
  } = pot;

  const applicationStartMs = new Date(application_start).getTime();
  const applicationEndMs = new Date(application_end).getTime();
  const publicRoundStartMs = new Date(matching_round_start).getTime();
  const publicRoundEndMs = new Date(matching_round_end).getTime();
  const cooldownEndMs = cooldown_end ? new Date(cooldown_end).getTime() : null;

  const now = Date.now();
  const applicationOpen = now >= applicationStartMs && now < applicationEndMs;
  const publicRoundOpen = now >= publicRoundStartMs && now < publicRoundEndMs;
  const cooldownPending =
    publicRoundEndMs && now >= publicRoundEndMs && !cooldownEndMs;
  const cooldownOpen = Boolean(
    cooldownEndMs && now >= publicRoundEndMs && now < cooldownEndMs,
  );
  const payoutsPending = Boolean(
    cooldownEndMs && now >= cooldownEndMs && !all_paid_out,
  );
  const payoutsCompleted = all_paid_out;

  const tags = [
    /* Application's has not started tag */
    {
      backgroundColor: "#EFFEFA",
      borderColor: "#33DDCB",
      textColor: "#023131",
      text: "Sponsorship Open",
      preElementsProps: {
        colorOuter: "#CAFDF3",
        colorInner: "#33DDCB",
        animate: true,
      },
      visibility: now < applicationStartMs,
    },
    /* Application tag */
    {
      backgroundColor: "#EFFEFA",
      borderColor: "#33DDCB",
      textColor: "#023131",
      text: daysUntil(applicationEndMs) + " left to apply",
      preElementsProps: {
        colorOuter: "#CAFDF3",
        colorInner: "#33DDCB",
        animate: true,
      },
      visibility: applicationOpen,
    },
    /* Matching round open tag */
    {
      backgroundColor: "#F7FDE8",
      borderColor: "#9ADD33",
      textColor: "#192C07",
      text: daysUntil(publicRoundEndMs) + " left to donate",
      preElementsProps: {
        colorOuter: "#D7F5A1",
        colorInner: "#9ADD33",
        animate: true,
      },
      visibility: publicRoundOpen,
    },
    /* Cooldown pending tag */
    {
      backgroundColor: "#F5F3FF",
      borderColor: "#A68AFB",
      textColor: "#2E0F66",
      text: "Cooldown pending",
      preElementsProps: {
        colorOuter: "#EDE9FE",
        colorInner: "#A68AFB",
        animate: true,
      },
      visibility: cooldownPending,
    },
    /* Matching round cooldown tag */
    {
      backgroundColor: "#F5F3FF",
      borderColor: "#A68AFB",
      textColor: "#2E0F66",
      text: "Challenge period",
      preElementsProps: {
        colorOuter: "#EDE9FE",
        colorInner: "#A68AFB",
        animate: true,
      },
      visibility: cooldownOpen,
    },
    /* Payouts pending tag */
    {
      backgroundColor: "#F7FDE8",
      borderColor: "#9ADD33",
      textColor: "#192C07",
      text: "Payouts pending",
      preElementsProps: {
        colorOuter: "#D7F5A1",
        colorInner: "#9ADD33",
        animate: true,
      },
      visibility: payoutsPending,
    },
    /* Matching round closed tag */
    {
      backgroundColor: "#464646",
      borderColor: "#292929",
      textColor: "#FFF",
      text: "Payouts completed",
      preElementsProps: {
        colorOuter: "#656565",
        colorInner: "#A6A6A6",
        animate: false,
      },
      visibility: payoutsCompleted,
    },
  ];

  return tags;
};

export default getPotTags;
