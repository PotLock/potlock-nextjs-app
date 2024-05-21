import { createModel } from "@rematch/core";

import { RootModel } from "@app/store/models";

interface AuthState {
  email?: string;
  name?: string;
  isSignedIn: boolean;
}

type SetUserData = AuthState;

/**
 * Auth State
 */
const initialState: AuthState = {
  email: "",
  name: "",
  isSignedIn: false,
};

export const auth = createModel<RootModel>()({
  state: initialState,

  reducers: {
    SET_DATA(state: AuthState, { name, email, isSignedIn }: SetUserData) {
      state.name = name || state.name;
      state.email = email || state.email;
      state.isSignedIn = isSignedIn || state.isSignedIn;
      return state;
    },

    // Reset to the initial state
    RESET() {
      return initialState;
    },
  },

  effects: (dispatch) => ({
    setAuthData(props: SetUserData) {
      dispatch.auth.SET_DATA(props);
    },
  }),
});
