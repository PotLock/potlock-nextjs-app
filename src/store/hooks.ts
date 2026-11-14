import {
  type TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector,
} from "react-redux";

import type { AppDispatcher, AppState } from ".";

export const useGlobalStoreSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useDispatch = useReduxDispatch<AppDispatcher>;
