import { createModel } from "@rematch/core";
import { prop } from "remeda";

import { type CampaignDonation } from "@/common/contracts/core/campaigns";
import type { DirectDonation } from "@/common/contracts/core/donation";
import { type PotDonation } from "@/common/contracts/core/pot";
import { useGlobalStoreSelector } from "@/store";
import { AppModel } from "@/store/models";

import { effects } from "./effects";
import {
  DonationAllocationStrategy,
  DonationAllocationStrategyEnum,
  DonationAllocationStrategyOption,
  DonationGroupAllocationStrategy,
  DonationGroupAllocationStrategyEnum,
  DonationGroupAllocationStrategyOption,
  DonationState,
  DonationStep,
} from "../types";

export * from "./schemas";

export const donationModelKey = "donation";

export const useDonationState = () => useGlobalStoreSelector(prop(donationModelKey));

export const donationAllocationStrategies: Record<
  DonationAllocationStrategy,
  DonationAllocationStrategyOption
> = {
  full: {
    label: "Direct donation",
    value: DonationAllocationStrategyEnum.full,
  },

  share: {
    label: "Quadratically matched donation",
    hintIfDisabled: "(no pots available)",
    value: DonationAllocationStrategyEnum.share,
  },
};

export const donationGroupAllocationStrategies: Record<
  DonationGroupAllocationStrategy,
  DonationGroupAllocationStrategyOption
> = {
  evenly: {
    label: "Evenly",
    hint: "(Allocate funds evenly across multiple projects)",
    value: DonationGroupAllocationStrategyEnum.evenly,
  },

  manually: {
    label: "Manually",
    hint: "(Specify amount for each project)",
    value: DonationGroupAllocationStrategyEnum.manually,
  },
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

    success(state, result: DirectDonation | PotDonation | CampaignDonation) {
      return { ...handleStep(state, "success"), finalOutcome: result };
    },

    failure(_, error: Error) {
      console.error(error);
    },
  },
});
