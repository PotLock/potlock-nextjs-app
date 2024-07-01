import { createModel } from "@rematch/core";

import { RootModel } from "@/app/_store/models";

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

export const navModel = createModel<RootModel>()({
  state: {
    // TODO: add is registry admin
    accountId: "",
    isNadabotVerified: false,
    actAsDao: {
      defaultAddress: "",
      toggle: false,
      addresses: [],
    },
  } as NavState,
  reducers: {
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
