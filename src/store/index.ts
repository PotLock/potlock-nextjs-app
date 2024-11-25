import { RematchDispatch, RematchRootState, init } from "@rematch/core";
import immerPlugin from "@rematch/immer";
import loadingPlugin, { ExtraModelsFromLoading } from "@rematch/loading";
import persistPlugin from "@rematch/persist";
import { TypedUseSelectorHook, useDispatch as useReduxDispatch, useSelector } from "react-redux";
import storage from "redux-persist/lib/storage";

import { AppModel, models } from "./models";

type FullModel = ExtraModelsFromLoading<AppModel, { type: "full" }>;

export const store = init<AppModel, FullModel>({
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
    persistPlugin({ key: "potlock", storage }),
  ],
});

export type Store = typeof store;
export type AppDispatcher = RematchDispatch<AppModel>;
export type AppState = RematchRootState<AppModel, FullModel>;

export const { dispatch } = store;

export const useDispatch = () => useReduxDispatch<AppDispatcher>();

export const useTypedSelector: TypedUseSelectorHook<AppState> = useSelector;

export const resetStore = () => {
  dispatch.projectEditor.RESET();
  dispatch.nav.RESET();
  dispatch.profiles.RESET();
};
