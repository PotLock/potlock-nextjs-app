import { create } from "zustand";

import { CartItem, CartOrderExecutionOutcome, CartOrderStep, CartState } from "../types";

interface CartStore extends CartState {
  reset: () => void;
  ordersExecuted: (data: CartOrderExecutionOutcome[]) => void;
  orderExecutionFailure: (error: Error) => void;
  checkout: () => void;
}

const initialState: CartState = {
  items: {},
  orderStep: "details",
  finalOutcome: { error: null },
};

export const useCartStore = create<CartStore>((set) => ({
  ...initialState,

  reset: () => set(initialState),

  ordersExecuted: (data: CartOrderExecutionOutcome[]) =>
    set((state) => ({
      ...state,
      orderStep: "result" as CartOrderStep,
      finalOutcome: { data, error: null },
    })),

  orderExecutionFailure: (error: Error) =>
    set((state) => ({
      ...state,
      orderStep: "result" as CartOrderStep,
      finalOutcome: { data: null, error },
    })),

  checkout: () => {
    console.log("checkout");
    set(initialState);
  },
}));

// Export for backward compatibility if needed
export const cartModel = {
  state: initialState,
};
