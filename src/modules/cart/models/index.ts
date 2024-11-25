import { createModel } from "@rematch/core";
import { mergeAll } from "remeda";

import { AppModel } from "@/store/models";

import { effects } from "./effects";
import { CartOrderExecutionOutcome, CartOrderStep, CartState } from "../types";

export * from "./schemas";

const cartStateDefaults: CartState = {
  items: {},
  orderStep: "details",
  finalOutcome: { error: null },
};

const handleStep = (state: CartState, orderStep: CartOrderStep, stateUpdate?: Partial<CartState>) =>
  mergeAll([state, stateUpdate ?? {}, { orderStep }]);

export const cartModel = createModel<AppModel>()({
  state: cartStateDefaults,
  effects,

  reducers: {
    reset: () => cartStateDefaults,

    ordersExecuted: (state, data: CartOrderExecutionOutcome[]) =>
      handleStep(state, "result", {
        finalOutcome: { data, error: null },
      }),

    orderExecutionFailure: (state, error: Error) =>
      handleStep(state, "result", {
        finalOutcome: { data: null, error },
      }),
  },
});
