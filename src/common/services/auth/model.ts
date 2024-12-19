import { createModel } from "@rematch/core";

import { AppModel } from "@/store/models";

interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
};

export const sessionModel = createModel<AppModel>()({
  state: initialState,

  reducers: {
    SET_DATA(state: AuthState, { isAuthenticated }: AuthState) {
      state.isAuthenticated = isAuthenticated;
    },

    RESET() {
      return initialState;
    },
  },

  effects: (dispatch) => ({
    setAuthData(props: AuthState) {
      dispatch.session.SET_DATA(props);
    },
  }),
});
