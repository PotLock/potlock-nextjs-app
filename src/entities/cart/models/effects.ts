import { AppDispatcher } from "@/store";

export const effects = (dispatch: AppDispatcher) => ({
  checkout: (): void => {
    // dispatch.donation.submit()
    dispatch.cart.reset();
  },
});
