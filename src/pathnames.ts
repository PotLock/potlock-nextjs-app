import type { AccountId, CampaignId } from "./common/types";

export const rootPathnames = {
  CURRENT: "",
  PROJECTS_LIST: "/",
  REGISTER: "/register",
  PROFILE: "/profile",
  EDIT_PROFILE: (accountId: AccountId) => `/profile/${accountId}/edit`,
  CART: "/cart",
  FEED: "/feed",
  POTS: "/pots",
  pot: "/pot",
  DEPLOY_POT: "/deploy",
  DONORS: "/donors",
  LIST: "/lists",
  CAMPAIGNS: "/campaigns",
  CAMPAIGN: (campaignId: CampaignId) => `/campaign/${campaignId}`,
};
