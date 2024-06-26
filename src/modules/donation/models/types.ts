import { UseFormReturn } from "react-hook-form";
import { infer as FromSchema } from "zod";

import { ByPotId } from "@/common/api/potlock";
import { DirectDonation } from "@/common/contracts/potlock/interfaces/donate.interfaces";
import { ByAccountId } from "@/common/types";
import { AvailableBalance } from "@/modules/core";

import { DonationAllocationStrategy, donationSchema } from "./schemas";

export type DonationInputs = FromSchema<typeof donationSchema>;

export type DonationParameters = ByAccountId | ByPotId;

export type DonationAllocationStrategyOption = {
  label: string;
  value: DonationAllocationStrategy;
  hint?: string;
  hintIfDisabled?: string;
};

export type DonationStep = "allocation" | "confirmation" | "success";

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
