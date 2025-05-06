import {
  type DonationAllocationStrategy,
  DonationAllocationStrategyEnum,
  type DonationAllocationStrategyOption,
  type DonationGroupAllocationStrategy,
  DonationGroupAllocationStrategyEnum,
  type DonationGroupAllocationStrategyOption,
} from "./types";

export const DONATION_MIN_NEAR_AMOUNT = 0.1;

export const DONATION_INSUFFICIENT_BALANCE_ERROR =
  "You don’t have enough balance to complete this transaction.";

export const DONATION_MIN_NEAR_AMOUNT_ERROR = `The minimum donation amount is ${
  DONATION_MIN_NEAR_AMOUNT
} NEAR`;

export const DONATION_MAX_MESSAGE_LENGTH = 100;

export const DONATION_BASE_STORAGE_DEPOSIT_FLOAT = 0.012;

export const DONATION_ALLOCATION_STRATEGIES: Record<
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

export const DONATION_GROUP_ALLOCATION_STRATEGIES: Record<
  DonationGroupAllocationStrategy,
  DonationGroupAllocationStrategyOption
> = {
  even: {
    label: "Evenly",
    hint: "(Allocate funds evenly across multiple projects)",
    value: DonationGroupAllocationStrategyEnum.even,
  },

  manual: {
    label: "Manually",
    hint: "(Specify amount for each project)",
    value: DonationGroupAllocationStrategyEnum.manual,
  },
};
