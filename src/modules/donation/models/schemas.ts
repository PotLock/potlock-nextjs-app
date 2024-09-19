import { UseFormReturn } from "react-hook-form";
import {
  infer as FromSchema,
  array,
  boolean,
  literal,
  nativeEnum,
  object,
  preprocess,
  string,
} from "zod";

import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { safePositiveNumber } from "@/common/lib";
import { AvailableBalance } from "@/modules/core";
import { TOTAL_FEE_BASIS_POINTS } from "@/modules/core/constants";

import {
  DONATION_MAX_MESSAGE_LENGTH,
  DONATION_MIN_NEAR_AMOUNT_ERROR,
} from "../constants";
import {
  DonationAllocationStrategyEnum,
  DonationPotDistributionStrategyEnum,
} from "../types";
import {
  donationFeeBasisPointsToPercents,
  donationFeePercentsToBasisPoints,
} from "../utils/converters";
import {
  isDonationAmountSufficient,
  isDonationMatchingPotSelected,
} from "../utils/validation";

export const donationTokenSchema = literal(NEAR_TOKEN_DENOM)
  .or(string().min(6))
  .default(NEAR_TOKEN_DENOM)
  .describe('Either "NEAR" or FT contract account id.');

export const donationAmount = safePositiveNumber;

export const donationFeeBasisPoints = preprocess(
  (value) =>
    typeof value === "string"
      ? donationFeePercentsToBasisPoints(safePositiveNumber.parse(value))
      : value,

  safePositiveNumber,
).refine((basisPoints) => basisPoints <= TOTAL_FEE_BASIS_POINTS, {
  message: `Fee cannot exceed ${donationFeeBasisPointsToPercents(TOTAL_FEE_BASIS_POINTS)}%.`,
});

export const donationSchema = object({
  tokenId: donationTokenSchema,
  amount: donationAmount.describe("Amount of the selected tokens to donate."),
  recipientAccountId: string().optional().describe("Recipient account id."),
  referrerAccountId: string().optional().describe("Referrer account id."),
  potAccountId: string().optional().describe("Pot account id."),

  potDonationRecipients: array(
    object({ account_id: string(), amount: donationAmount.optional() }),
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

  potDistributionStrategy: nativeEnum(DonationPotDistributionStrategyEnum, {
    message: "Incorrect donation distribution strategy.",
  }).default(DonationPotDistributionStrategyEnum.evenly),

  bypassProtocolFee: boolean().default(false),
  bypassChefFee: boolean().default(false),
})
  .refine(isDonationMatchingPotSelected, { message: "Pot is not selected." })
  .refine(isDonationAmountSufficient, {
    /**
     *? NOTE: Due to an unknown issue,
     *?  this message doesn't end up in react-hook-form's `formState.errors`.
     *?  Please make sure it's always manually provided to the corresponding input field.
     */
    message: DONATION_MIN_NEAR_AMOUNT_ERROR,
    path: ["amount"],
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
