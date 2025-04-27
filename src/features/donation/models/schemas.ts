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

import { NATIVE_TOKEN_ID } from "@/common/constants";
import { safePositiveNumber } from "@/common/lib";
import type { AccountId } from "@/common/types";
import { TokenAvailableBalance } from "@/entities/_shared/token";

import { DONATION_MAX_MESSAGE_LENGTH, DONATION_MIN_NEAR_AMOUNT_ERROR } from "../constants";
import { DonationAllocationStrategyEnum, DonationGroupAllocationStrategyEnum } from "../types";
import { isDonationAmountSufficient, isDonationMatchingPotSelected } from "../utils/validation";

export const donationTokenSchema = literal(NATIVE_TOKEN_ID)
  .or(string().min(6))
  //? Make sure the default donation token always corresponds to the native token
  .default(NATIVE_TOKEN_ID)
  .describe('Either "NEAR" or FT contract account id.');

export const donationAmount = safePositiveNumber;

/**
 * # Heads up!
 *
 * The donation fee is stored in basis points, but the schema expects it to be a percentage.
 *
 * Thus make sure to convert it to percents before passing to the form
 *  and convert it back to basis points before passing to the contract.
 */
export const donationFee = preprocess(
  (value) => (typeof value === "string" ? safePositiveNumber.parse(value) : value),
  safePositiveNumber,
)
  .refine((percents) => percents < 100, { message: "Fee must be less than 100%." })
  .refine((percents) => Number.isInteger(percents), {
    message: "Fractional percentage is not supported.",
  });

export const donationSchema = object({
  tokenId: donationTokenSchema,
  amount: donationAmount.describe("Amount of the selected tokens to donate."),
  recipientAccountId: string().optional().describe("Recipient account id."),
  potAccountId: string().optional().describe("Pot account id."),
  listId: number().optional().describe("List id."),
  campaignId: number().optional().describe("Campaign id."),
  message: string().max(DONATION_MAX_MESSAGE_LENGTH).optional().describe("Donation message."),

  allocationStrategy: nativeEnum(DonationAllocationStrategyEnum, {
    message: "Incorrect allocation strategy.",
  }).default(DonationAllocationStrategyEnum.full),

  groupAllocationStrategy: nativeEnum(DonationGroupAllocationStrategyEnum, {
    message: "Incorrect group allocation strategy.",
  }).default(DonationGroupAllocationStrategyEnum.even),

  groupAllocationPlan: array(object({ account_id: string(), amount: donationAmount.optional() }))
    .min(1, { message: "You have to select at least one recipient." })
    .optional(),

  bypassProtocolFee: boolean().default(false),
  bypassChefFee: boolean().default(false),
})
  .refine(isDonationMatchingPotSelected, {
    message: "Pot is not selected.",
    path: ["potAccountId"],
  })
  .refine(isDonationAmountSufficient, {
    message: DONATION_MIN_NEAR_AMOUNT_ERROR,
    path: ["amount"],
  });

export type DonationInputs = FromSchema<typeof donationSchema>;

export const donationDependentFields: (keyof DonationInputs)[] = ["amount", "potAccountId"];

export type DonationSubmitParams = DonationInputs & {
  referrerAccountId?: AccountId;
};

export type DonationFormAPI = UseFormReturn<DonationInputs>;

export interface WithDonationFormAPI {
  form: DonationFormAPI;
}

export type DonationAllocationInputs = WithDonationFormAPI &
  Pick<TokenAvailableBalance, "balanceFloat"> & {
    isBalanceSufficient: boolean;
    minAmountError: string | null;
  };
