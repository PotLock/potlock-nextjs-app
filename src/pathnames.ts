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

  PROFILE_BY_ID_EDIT: (accountId: AccountId) =>
    [rootPathnames.PROFILE, accountId, "edit"].join("/"),
};
