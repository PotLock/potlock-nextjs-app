import { createModel } from "@rematch/core";

import { NEARSocialUserProfile } from "@/common/contracts/social";
import { AppModel } from "@/store/models";

export type Profile = {
  socialData: NEARSocialUserProfile;
  tags: string[];
  team: string[];
  totalAmountNear: string;

  socialImages: {
    image: string;
    backgroundImage: string;
  };
};

export type ActAsDao = {
  toggle: boolean;
  defaultAddress: string;
  addresses: string[];
};

export type NavState = {
  accountId: string;
  isNadabotVerified: boolean;
  actAsDao: ActAsDao;
};

const initialState: NavState = {
  // TODO: add is registry admin
  accountId: "",
  isNadabotVerified: false,
  actAsDao: {
    defaultAddress: "",
    toggle: false,
    addresses: [],
  },
};

export const navModel = createModel<AppModel>()({
  state: initialState,
  reducers: {
    // Reset to the initial state
    RESET() {
      return initialState;
    },

    updateActAsDao(state, payload) {
      return {
        ...state,
        actAsDao: {
          ...state.actAsDao,
          ...payload,
        },
      };
    },
    update(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },
});
