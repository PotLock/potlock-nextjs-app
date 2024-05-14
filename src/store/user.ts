import { createModel } from "@rematch/core";

import { RootModel } from "./models";

interface UserState {
  email?: string;
  name?: string;
}

type SetUserData = UserState;

const initialState: UserState = {
  email: "",
  name: "",
};

export const user = createModel<RootModel>()({
  state: initialState,

  reducers: {
    SET_USER_DATA(state: UserState, { name, email }: SetUserData) {
      state.name = name || state.name;
      state.email = email || state.email;
      return state;
    },

    // Reset to the initial state
    RESET() {
      return initialState;
    },
  },

  effects: (dispatch) => ({
    setUserData(props: SetUserData) {
      dispatch.user.SET_USER_DATA(props);
    },
  }),
});
