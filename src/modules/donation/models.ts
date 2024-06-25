import { createModel } from "@rematch/core";
import { UseFormReturn } from "react-hook-form";
import {
  infer as FromSchema,
  array,
  boolean,
  literal,
  nativeEnum,
  number,
  object,
  preprocess,
  string,
} from "zod";

import { RootModel } from "@/app/_store/models";
import { ByPotId } from "@/common/api/potlock";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { donateNearDirectly } from "@/common/contracts/potlock/donate";
import { DirectDonation } from "@/common/contracts/potlock/interfaces/donate.interfaces";
import { floatToYoctoNear } from "@/common/lib";
import { ByAccountId } from "@/common/types";
import { AvailableBalance } from "@/modules/core";

import {
  DONATION_MAX_MESSAGE_LENGTH,
  DONATION_MIN_NEAR_AMOUNT_ERROR,
} from "./constants";
import { isDonationAmountSufficient } from "./utils/validation";

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
    hintIfDisabled: "(WIP)", // "(no pots available)",
    value: DonationAllocationStrategyEnum.pot,
  },
};

export type DonationStep = "allocation" | "confirmation" | "success";

export const donationTokenSchema = literal(NEAR_TOKEN_DENOM)
  .or(string().min(6))
  .default(NEAR_TOKEN_DENOM)
  .describe('Either "NEAR" or FT contract account id.');

export const donationAmountSchema = preprocess(
  (x) => parseFloat(x as string),

  number({ message: "Must be a positive number." })
    .positive("Must be a positive number.")
    .finite()
    .safe()
    .transform((n) => number().safeParse(n).data ?? 0),
);

export const donationSchema = object({
  tokenId: donationTokenSchema,

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
}).refine(isDonationAmountSufficient, {
  /**
   *? NOTE: Due to an unknown issue,
   *?  this message doesn't end up in react-hook-form's `formState.errors`.
   *?  Please make sure it's always manually provided to the corresponding input field.
   */
  message: DONATION_MIN_NEAR_AMOUNT_ERROR,
});

export type DonationInputs = FromSchema<typeof donationSchema>;

export type DonationAllocationInputs = Pick<
  AvailableBalance,
  "balanceFloat"
> & {
  isBalanceSufficient: boolean;
  minAmountError: string | null;
  form: UseFormReturn<DonationInputs>;
};

export type DonationSubmissionInputs = ByAccountId | ByPotId;

export type DonationState = {
  currentStep: DonationStep;
  successResult?: DirectDonation;
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
      return { ...state, successResult: result };
    },

    failure(_, error: Error) {
      console.error(error);
    },
  },

  effects: (dispatch) => ({
    async submit({
      amount,
      allocationStrategy,
      potDistributionStrategy,
      referrerAccountId,
      bypassProtocolFee,
      message,
      ...props
    }: DonationSubmissionInputs & DonationInputs): Promise<void> {
      if ("accountId" in props) {
        switch (allocationStrategy) {
          case DonationAllocationStrategyEnum.direct: {
            const args = {
              recipient_id: props.accountId,
              message,
              referrer_id: referrerAccountId,
              bypass_protocol_fee: bypassProtocolFee,
            };

            console.table({ args, amount: floatToYoctoNear(amount) });

            return void donateNearDirectly(args, floatToYoctoNear(amount))
              .then((result) => {
                dispatch.donation.success(result);
                dispatch.donation.nextStep();
              })
              .catch((error) => dispatch.donation.failure(error));
          }

          case DonationAllocationStrategyEnum.pot:
            return void dispatch.donation.failure;
        }
      } else if ("potId" in props) {
        switch (potDistributionStrategy) {
          case DonationPotDistributionStrategy.evenly: {
            return void dispatch.donation.failure;
          }

          case DonationPotDistributionStrategy.manually: {
            return void dispatch.donation.failure;
          }
        }
      }
    },
  }),
});
