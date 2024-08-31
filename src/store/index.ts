import { RematchDispatch, RematchRootState, init } from "@rematch/core";
import immerPlugin from "@rematch/immer";
import loadingPlugin, { ExtraModelsFromLoading } from "@rematch/loading";
import persistPlugin from "@rematch/persist";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import storage from "redux-persist/lib/storage";

import { RootModel, models } from "./models";

type FullModel = ExtraModelsFromLoading<RootModel, { type: "full" }>;

export const store = init<RootModel, FullModel>({
  models,
  redux: {
    devtoolOptions: {
      trace: true,
      traceLimit: 25,
    },
  },
  plugins: [
    // Wraps your reducers with immer, providing ability to safely do mutable
    // changes resulting in immutable state.
    // https://rematchjs.org/docs/plugins/immer/
    immerPlugin(),
    // Adds automated loading indicators for effects, so you don't
    // need to manage state like loading:  true by yourself.
    // https://rematchjs.org/docs/plugins/loading/
    loadingPlugin({ type: "full" }),
    // Provides automatic Redux state persistence.
    // https://rematchjs.org/docs/plugins/persist/
    persistPlugin({
      key: "root",
      storage,
    }),
  ],
});

export type Store = typeof store;
export type RootDispatcher = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel, FullModel>;

// dispatch
export const { dispatch } = store;

// selector
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

// reset all
export const resetStore = () => {
  dispatch.createProject.RESET();
  dispatch.nav.RESET();
  dispatch.profiles.RESET();
};
