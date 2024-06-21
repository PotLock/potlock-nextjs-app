import { createModel } from "@rematch/core";
import {
  infer as FromSchema,
  array,
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

export type DonationParameters = ByAccountId | ByPotId;

export enum DonationAllocationStrategyEnum {
  direct = "direct",
  pot = "pot",
}

export type DonationAllocationStrategy =
  keyof typeof DonationAllocationStrategyEnum;

export enum DonationPotDistributionStrategy {
  evenly = "evenly",
  manually = "manually",
}

export type DonationPotDistributionStrategyKey =
  keyof typeof DonationPotDistributionStrategy;

export type DonationAllocationStrategyOption = {
  label: string;
  value: DonationAllocationStrategy;
  hint?: string;
  hintIfDisabled?: string;
};

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

export type DonationStep = "allocation" | "confirmation" | "success";

export const donationTokenSchema = literal(NEAR_TOKEN_DENOM)
  .or(string().min(6))
  .default(NEAR_TOKEN_DENOM)
  .describe('Either "NEAR" or FT contract account id.');

export const donationAmountSchema = number()
  .positive()
  .finite()
  .lt(0.0, "Cannot be zero.")
  .default(0.1)
  .refine(
    (n) => !number().int().safeParse(n).success,
    "Must be a floating point number.",
  );

export const donationSchema = object({
  token: donationTokenSchema,

  amount: donationAmountSchema.describe(
    "Amount of the selected tokens to donate.",
  ),

  recipientAccountId: string().optional().describe("Recipient account id."),
  referrerAccountId: string().optional().describe("Referrer account id."),
  potAccountId: string().optional().describe("Pot account id."),

  potDonationDistribution: array(
    object({ account_id: string(), amount: donationAmountSchema }),
  )
    .refine((recipients) => recipients.length > 0, {
      message: "You have to select at least one recipient.",
    })
    .optional(),

  message: string()
    .max(DONATION_MAX_MESSAGE_LENGTH)
    .optional()
    .describe("Donation message."),

  allocationStrategy: nativeEnum(DonationAllocationStrategyEnum, {
    message: "Incorrect allocation strategy.",
  }).default(DonationAllocationStrategyEnum.direct),

  potDistributionStrategy: nativeEnum(DonationPotDistributionStrategy, {
    message: "Incorrect donation distribution strategy.",
  }).default(DonationPotDistributionStrategy.evenly),

  bypassProtocolFee: boolean().default(false),
  bypassChefFee: boolean().default(false),
}).refine(
  ({ token, amount }) =>
    token === NEAR_TOKEN_DENOM
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

export type DonationSubmissionInputs = ByAccountId | ByPotId;

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
    submit({
      amount,
      allocationStrategy,
      potDistributionStrategy,
      ...props
    }: DonationSubmissionInputs & DonationInputs) {
      if ("accountId" in props) {
        switch (allocationStrategy) {
          case DonationAllocationStrategyEnum.direct:
            return donateNearDirectly({ recipient_id: props.accountId }, amount)
              .then(dispatch.success)
              .catch(dispatch.failure);

          case DonationAllocationStrategyEnum.pot:
            return dispatch.failure;
        }
      } else if ("potId" in props) {
        switch (potDistributionStrategy) {
          case DonationPotDistributionStrategy.evenly:
            return dispatch.failure;

          case DonationPotDistributionStrategy.manually:
            return dispatch.failure;
        }
      }
    },
  }),
});
