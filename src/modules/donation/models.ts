import { createModel } from "@rematch/core";

import { RootModel } from "@/app/_store/models";
import { ByAccountId, ByPotId } from "@/common/api/potlock";

export type DonationInputs = ByAccountId | ByPotId;

export type DonationStep = "allocation" | "confirmation" | "done";

export type DonationState = {
  currentStep: DonationStep;
};

const setStep = (state: DonationState, step: DonationStep) => ({
  ...state,
  currentStep: step,
});

const donationStateDefaults: DonationState = {
  currentStep: "allocation",
};

export const donationModel = createModel<RootModel>()({
  state: donationStateDefaults,

  reducers: {
    reset() {
      return donationStateDefaults;
    },

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
