import { useCallback, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";

import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { walletApi } from "@/common/contracts";
import { useAvailableBalance } from "@/modules/core";
import useIsHuman from "@/modules/core/hooks/useIsHuman";
import { dispatch } from "@/store";

import {
  DONATION_MIN_NEAR_AMOUNT,
  DONATION_MIN_NEAR_AMOUNT_ERROR,
} from "../constants";
import {
  DonationAllocationStrategyEnum,
  DonationInputs,
  DonationPotDistributionStrategy,
  DonationSubmissionInputs,
  donationSchema,
  donationTokenSchema,
} from "../models";
import { isDonationAmountSufficient } from "../utils/validation";

export type DonationFormParams = DonationSubmissionInputs & {
  referrerAccountId?: string;
};

export const useDonationForm = ({
  referrerAccountId,
  ...params
}: DonationFormParams) => {
  const defaultValues = useMemo<Partial<DonationInputs>>(
    () => ({
      allocationStrategy:
        DonationAllocationStrategyEnum[
          "accountId" in params ? "direct" : "pot"
        ],

      tokenId: donationTokenSchema.parse(undefined),
      recipientAccountId: "accountId" in params ? params.accountId : undefined,
      referrerAccountId,
      potAccountId: "potId" in params ? params.potId : undefined,

      potDistributionStrategy:
        DonationPotDistributionStrategy[
          "accountId" in params ? "manually" : "evenly"
        ],
    }),

    [params, referrerAccountId],
  );

  const form = useForm<DonationInputs>({
    resolver: zodResolver(donationSchema),
    mode: "onChange",
    defaultValues,
  });

  const currentValues = useWatch({ control: form.control });
  const amount = currentValues.amount ?? 0;
  const tokenId = currentValues.tokenId ?? NEAR_TOKEN_DENOM;
  const { balanceFloat } = useAvailableBalance({ tokenId });

  const hasChanges = Object.keys(currentValues).some((key) => {
    const defaultValue = defaultValues[key as keyof DonationInputs];
    const currentValue = currentValues[key as keyof DonationInputs];

    return currentValue !== defaultValue;
  });

  const isBalanceSufficient = amount < (balanceFloat ?? 0);

  const isDisabled =
    !hasChanges ||
    !form.formState.isValid ||
    form.formState.isSubmitting ||
    !isBalanceSufficient;

  const isSenderHumanVerified = useIsHuman(walletApi.accountId ?? "unknown");

  const minAmountError =
    !isDonationAmountSufficient({ amount, tokenId }) && hasChanges
      ? DONATION_MIN_NEAR_AMOUNT_ERROR
      : null;

  const onSubmit: SubmitHandler<DonationInputs> = useCallback(
    (values) => dispatch.donation.submit({ ...values, ...params }),
    [params],
  );

  return {
    hasChanges,
    isBalanceSufficient,
    isDisabled,
    isSenderHumanVerified,
    form,
    minAmountError,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
