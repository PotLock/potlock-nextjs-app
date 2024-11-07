import { NATIVE_TOKEN_ID } from "@/common/constants";
import { ByTokenId } from "@/common/types";

import { DONATION_MIN_NEAR_AMOUNT } from "../constants";
import {
  DonationAllocationStrategy,
  DonationAllocationStrategyEnum,
} from "../types";

export type DonationAmountValidationInputs = ByTokenId & { amount: number };

export const isDonationAmountSufficient = ({
  tokenId,
  amount,
}: DonationAmountValidationInputs) =>
  tokenId === NATIVE_TOKEN_ID
    ? amount >= DONATION_MIN_NEAR_AMOUNT
    : amount > 0.0;

export type DonationMatchingPotValidationInputs = {
  allocationStrategy: DonationAllocationStrategy;
  potAccountId?: string;
  listId?: number;
};

export const isDonationMatchingPotSelected = ({
  allocationStrategy,
  potAccountId,
  listId,
}: DonationMatchingPotValidationInputs) =>
  allocationStrategy === DonationAllocationStrategyEnum.split &&
  listId === undefined
    ? Boolean(potAccountId)
    : true;
