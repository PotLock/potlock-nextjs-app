import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { ByTokenId } from "@/common/types";

import { DONATION_MIN_NEAR_AMOUNT } from "../constants";
import { DonationAllocationStrategy } from "../types";

export type DonationAmountValidationInputs = ByTokenId & { amount: number };

export const isDonationAmountSufficient = ({
  tokenId,
  amount,
}: DonationAmountValidationInputs) =>
  tokenId === NEAR_TOKEN_DENOM
    ? amount >= DONATION_MIN_NEAR_AMOUNT
    : amount > 0.0;

export type DonationMatchingPotValidationInputs = {
  allocationStrategy: DonationAllocationStrategy;
  potAccountId?: string;
};

export const isDonationMatchingPotSelected = ({
  allocationStrategy,
  potAccountId,
}: DonationMatchingPotValidationInputs) =>
  allocationStrategy === "pot"
    ? typeof potAccountId === "string" && potAccountId.length > 0
    : true;
