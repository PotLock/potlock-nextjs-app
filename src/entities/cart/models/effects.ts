import { AppDispatcher } from "@/store";

export const effects = (dispatch: AppDispatcher) => ({
  checkout: (): void => {
    // dispatch.donation.submit()
    console.log("checkout");
    dispatch.cart.reset();
  },
});
