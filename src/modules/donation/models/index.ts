import { createModel } from "@rematch/core";

import { DirectDonation } from "@/common/contracts/potlock/interfaces/donate.interfaces";
import { PotDonation } from "@/common/contracts/potlock/interfaces/pot.interfaces";
import { RootModel } from "@/store/models";

import { effects } from "./effects";
import {
  DonationAllocationStrategy,
  DonationAllocationStrategyEnum,
  DonationAllocationStrategyOption,
  DonationState,
  DonationStep,
} from "../types";

export * from "./schemas";

export const donationAllocationStrategies: Record<
  DonationAllocationStrategy,
  DonationAllocationStrategyOption
> = {
  direct: {
    label: "Direct donation",
    value: DonationAllocationStrategyEnum.direct,
  },

  pot: {
    label: "Quadratically matched donation",
    hintIfDisabled: "(no pots available)",
    value: DonationAllocationStrategyEnum.pot,
  },
};

const donationStateDefaults: DonationState = {
  currentStep: "allocation",
};

const handleStep = (state: DonationState, step: DonationStep) => ({
  ...state,
  currentStep: step,
});

export const donationModel = createModel<RootModel>()({
  state: donationStateDefaults,
  effects,

  reducers: {
    reset() {
      return donationStateDefaults;
    },

    nextStep(state) {
      switch (state.currentStep) {
        case "allocation":
          return handleStep(state, "confirmation");

        case "confirmation":
          return handleStep(state, "success");
      }
    },

    previousStep(state) {
      switch (state.currentStep) {
        case "confirmation":
          return handleStep(state, "allocation");
      }
    },

    success(state, result: DirectDonation | PotDonation) {
      return { ...handleStep(state, "success"), finalOutcome: result };
    },

    failure(_, error: Error) {
      console.error(error);
    },
  },
});
