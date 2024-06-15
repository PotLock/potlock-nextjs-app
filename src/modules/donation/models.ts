import { createModel } from "@rematch/core";
import { infer as FromSchema, nativeEnum, object } from "zod";

import { RootModel } from "@/app/_store/models";
import { ByAccountId, ByPotId } from "@/common/api/potlock";

export type DonationParameters = ByAccountId | ByPotId;

export enum DonationType {
  direct = "direct",
  pot = "pot",
}

export type DonationOption = {
  title: string;
  value: DonationType;
  hint?: string;
  hintIfDisabled?: string;
};

export type DonationStep = "allocation" | "confirmation" | "done";

export const donationSchema = object({
  donationType: nativeEnum(DonationType),
});

export type DonationInputs = FromSchema<typeof donationSchema>;

export type DonationState = {
  currentStep: DonationStep;
};

const handleStep = (state: DonationState, step: DonationStep) => ({
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
          return handleStep(state, "confirmation");

        case "confirmation":
          return handleStep(state, "done");
      }
    },

    handlePrevStep(state) {
      switch (state.currentStep) {
        case "confirmation":
          return handleStep(state, "allocation");
      }
    },
  },
});
