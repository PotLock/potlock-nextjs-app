import { createModel } from "@rematch/core";

import { RootModel } from "@/app/_store/models";

export type DonationStep = "allocation" | "confirmation" | "done";

export type DonationState = {
  currentStep: DonationStep;
};

const setStep = (state: DonationState, step: DonationStep) => ({
  ...state,
  currentStep: step,
});

export const donationModel = createModel<RootModel>()({
  state: {
    currentStep: "allocation",
  } as DonationState,

  reducers: {
    handleNextStep(state) {
      switch (state.currentStep) {
        case "allocation":
          return setStep(state, "confirmation");

        case "confirmation":
          return setStep(state, "done");
      }
    },

    handlePrevStep(state) {
      switch (state.currentStep) {
        case "confirmation":
          return setStep(state, "allocation");
      }
    },
  },
});
