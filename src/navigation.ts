import type { AccountId, CampaignId } from "./common/types";

export const rootPathnames = {
  CURRENT: "",
  PROJECTS: "/",
  CART: "/cart",
  CAMPAIGN: "/campaign",
  CAMPAIGNS: "/campaigns",
  DEPLOY_POT: "/deploy",
  DONORS: "/donors",
  FEED: "/feed",
  LIST: "/lists",
  pot: "/pot",
  POTS: "/pots",
  PROFILE: "/profile",
  REGISTER: "/register",
};

export const routeSelectors = {
  CAMPAIGN_BY_ID: (campaignId: CampaignId) => [rootPathnames.CAMPAIGN, campaignId].join("/"),

  CAMPAIGN_BY_ID_LEADERBOARD: (campaignId: CampaignId) =>
    [rootPathnames.CAMPAIGN, campaignId, "leaderboard"].join("/"),

  CAMPAIGN_BY_ID_SETTINGS: (campaignId: CampaignId) =>
    [rootPathnames.CAMPAIGN, campaignId, "settings"].join("/"),

  PROFILE_BY_ID: (accountId: AccountId) => [rootPathnames.PROFILE, accountId].join("/"),

  PROFILE_BY_ID_EDIT: (accountId: AccountId) =>
    [rootPathnames.PROFILE, accountId, "edit"].join("/"),

  PROFILE_BY_ID_FUNDING_RAISED: (accountId: AccountId) =>
    [rootPathnames.PROFILE, accountId, "funding-raised"].join("/"),
};
