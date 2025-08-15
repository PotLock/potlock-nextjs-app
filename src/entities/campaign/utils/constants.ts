import { V1CampaignsRetrieveStatus } from "@/common/api/indexer";

export const CAMPAIGN_MAX_FEE_POINTS = 1000;

export const CAMPAIGN_STATUS_OPTIONS: { label: string; val: V1CampaignsRetrieveStatus | "all" }[] =
  [
    { label: "All", val: "all" },
    { label: "Active", val: "active" },
    { label: "Ended", val: "ended" },
    { label: "Unfulfilled", val: "unfufilled" },
    { label: "Upcoming", val: "upcoming" },
  ];
