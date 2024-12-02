import { useCartStore } from "../models";

export const useCart = () => {
  const { items, orderStep, finalOutcome, reset, ordersExecuted, orderExecutionFailure, checkout } =
    useCartStore();

  return {
    items,
    orderStep,
    finalOutcome,
    reset,
    ordersExecuted,
    orderExecutionFailure,
    checkout,
  };
};
