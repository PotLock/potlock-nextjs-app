import { createModel } from "@rematch/core";

import { RootModel } from "@app/store/models";

interface AuthState {
  isAuthenticated: boolean;
}

/**
 * Auth State
 */
const initialState: AuthState = {
  isAuthenticated: false,
};

export const auth = createModel<RootModel>()({
  state: initialState,

  reducers: {
    SET_DATA(state: AuthState, { isAuthenticated }: AuthState) {
      state.isAuthenticated = isAuthenticated;
    },

    // Reset to the initial state
    RESET() {
      return initialState;
    },
  },

  effects: (dispatch) => ({
    setAuthData(props: AuthState) {
      dispatch.auth.SET_DATA(props);
    },
  }),
});
