import { createModel } from "@rematch/core";
import { mergeAll } from "remeda";

import { AppModel } from "@/store/models";

import { effects } from "./effects";
import { CartCheckoutStep, CartOrderOutcome, CartState } from "../types";

export * from "./schemas";

const cartStateDefaults: CartState = {
  orders: {},
  checkoutStep: "details",
  finalOutcome: { error: null },
};

const handleStep = (
  state: CartState,
  checkoutStep: CartCheckoutStep,
  stateUpdate?: Partial<CartState>,
) => mergeAll([state, stateUpdate ?? {}, { checkoutStep }]);

export const cartModel = createModel<AppModel>()({
  state: cartStateDefaults,
  effects,

  reducers: {
    reset: () => cartStateDefaults,

    ordersExecuted: (state, data: CartOrderOutcome[]) =>
      handleStep(state, "result", {
        finalOutcome: { data, error: null },
      }),

    orderExecutionFailure: (state, error: Error) =>
      handleStep(state, "result", {
        finalOutcome: { data: null, error },
      }),
  },
});
