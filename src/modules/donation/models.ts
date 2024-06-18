import { createModel } from "@rematch/core";
import {
  infer as FromSchema,
  boolean,
  literal,
  nativeEnum,
  number,
  object,
  string,
} from "zod";

import { RootModel } from "@/app/_store/models";
import { ByAccountId, ByPotId } from "@/common/api/potlock";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { donateNearDirectly } from "@/common/contracts/potlock/donate";
import { DirectDonation } from "@/common/contracts/potlock/interfaces/donate.interfaces";

import {
  DONATION_MAX_MESSAGE_LENGTH,
  DONATION_MIN_NEAR_AMOUNT,
} from "./constants";

export enum DonationAllocationType {
  direct = "direct",
  pot = "pot",
}

export type DonationParameters = ByAccountId | ByPotId;

export type DonationAllocationOption = {
  title: string;
  value: DonationAllocationType;
  hint?: string;
  hintIfDisabled?: string;
};

export const donationAllocationOptions: Record<
  DonationAllocationType,
  DonationAllocationOption
> = {
  [DonationAllocationType.direct]: {
    title: "Direct donation",
    value: DonationAllocationType.direct,
  },

  [DonationAllocationType.pot]: {
    title: "Quadratically matched donation",
    hintIfDisabled: "(no pots available)",
    value: DonationAllocationType.pot,
  },
};

export type DonationStep = "allocation" | "confirmation" | "success";

export const donationSchema = object({
  donationType: nativeEnum(DonationAllocationType, {
    message: "Incorrect donation type",
  }).default(DonationAllocationType.direct),

  tokenId: literal(NEAR_TOKEN_DENOM)
    .or(string().min(6))
    .default(NEAR_TOKEN_DENOM)
    .describe('Either "NEAR" or FT contract account id.'),

  amount: number()
    .positive()
    .finite()
    .lt(0.0, "Cannot be zero.")
    .default(0.1)
    .refine(
      (n) => !number().int().safeParse(n).success,
      "Must be a floating point number.",
    )
    .describe("Amount of the selected tokens to donate."),

  message: string()
    .max(DONATION_MAX_MESSAGE_LENGTH)
    .nullable()
    .optional()
    .describe("Donation message."),

  bypassProtocolFee: boolean().default(false),

  bypassChefFee: boolean().default(false),
}).refine(
  ({ tokenId, amount }) =>
    tokenId === NEAR_TOKEN_DENOM
      ? amount > DONATION_MIN_NEAR_AMOUNT
      : amount > 0.0,

  `The minimum donation amount is ${DONATION_MIN_NEAR_AMOUNT} NEAR.`,
);

export type DonationInputs = FromSchema<typeof donationSchema>;

export type DonationState = {
  currentStep: DonationStep;
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

    success(state, result: DirectDonation) {
      console.log(result);
      this.nextStep(state);
    },

    failure(_, error: Error) {
      console.error(error);
    },
  },

  effects: (dispatch) => ({
    submit({ amount, donationType, recipientAccountId }: DonationInputs) {
      switch (donationType) {
        case DonationAllocationType.direct:
          return donateNearDirectly(
            { recipient_id: recipientAccountId },
            amount,
          )
            .then(dispatch.success)
            .catch(dispatch.failure);
      }
    },
  }),
});
