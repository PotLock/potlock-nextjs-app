import { createModel } from "@rematch/core";

import { RootModel } from "@/app/_store/models";

interface CoreState {
  nearToUsd: number;
}

/**
 * Auth State
 */
const initialState: CoreState = {
  nearToUsd: 0,
};

export const core = createModel<RootModel>()({
  state: initialState,

  reducers: {
    SET_NEAR_TO_USD(state: CoreState, { nearToUsd }: { nearToUsd: number }) {
      state.nearToUsd = nearToUsd;
    },

    // Rese t to the initial state
    RESET() {
      return initialState;
    },
  },

  effects: (dispatch) => ({
    async fetchNearToUsd() {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd",
        { cache: "force-cache" },
      );

      if (response.ok) {
        const data = await response.json();
        dispatch.core.SET_NEAR_TO_USD({ nearToUsd: data.near.usd });
      }
    },
  }),
});
