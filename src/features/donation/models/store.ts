import { createModel } from "@rematch/core";
import { prop } from "remeda";

import { type CampaignDonation } from "@/common/contracts/core/campaigns";
import type { DirectDonation } from "@/common/contracts/core/donation";
import { type PotDonation } from "@/common/contracts/core/pot";
import { useGlobalStoreSelector } from "@/store/hooks";
import { type AppModel } from "@/store/models";

import { DonationStep } from "../types";
import { effects } from "./effects";

export const donationModelKey = "donation";

export const useDonationState = () => useGlobalStoreSelector(prop(donationModelKey));

export type DonationState = {
  currentStep: DonationStep;
  finalOutcome?: DirectDonation | PotDonation | CampaignDonation | DirectDonation[] | PotDonation[];
};

const donationStateDefaults: DonationState = {
  currentStep: "allocation",
};

const handleStep = (state: DonationState, step: DonationStep) => ({
  ...state,
  currentStep: step,
});

export const donationModel = createModel<AppModel>()({
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

    success(
      state,
      result: DirectDonation | PotDonation | CampaignDonation | DirectDonation[] | PotDonation[],
    ) {
      return { ...handleStep(state, "success"), finalOutcome: result };
    },

    failure(_, error: Error) {
      console.error(error);
    },
  },
});
