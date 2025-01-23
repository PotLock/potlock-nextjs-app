import type { AccountId } from "./common/types";

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
};

// ?INFO: This default export is for temporary backwards compatibility
// !INFO: default exports are evil.
// TODO: Remove in the future
export default rootPathnames;
