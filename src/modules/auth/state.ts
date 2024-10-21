import { createModel } from "@rematch/core";

import { AppModel } from "@/store/models";

interface AuthState {
  isAuthenticated: boolean;
}

/**
 * Auth State
 */
const initialState: AuthState = {
  isAuthenticated: false,
};

export const auth = createModel<AppModel>()({
  state: initialState,

  reducers: {
    SET_DATA(state: AuthState, { isAuthenticated }: AuthState) {
      state.isAuthenticated = isAuthenticated;
    },

    // Rese t to the initial state
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
