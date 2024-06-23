import { useCallback, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";

import { dispatch } from "@/app/_store";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { walletApi } from "@/common/contracts";
import { useAvailableBalance } from "@/modules/core";
import useIsHuman from "@/modules/core/hooks/useIsHuman";

import {
  DonationAllocationStrategyEnum,
  DonationInputs,
  DonationPotDistributionStrategy,
  DonationSubmissionInputs,
  donationSchema,
  donationTokenSchema,
} from "../models";

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
    defaultValues,
  });

  const currentValues = useWatch({ control: form.control });
  const tokenId = currentValues.tokenId ?? NEAR_TOKEN_DENOM;
  const { balanceFloat } = useAvailableBalance({ tokenId });

  const hasChanges = Object.keys(currentValues).some((key) => {
    const defaultValue = defaultValues[key as keyof DonationInputs];
    const currentValue = currentValues[key as keyof DonationInputs];

    return currentValue !== defaultValue;
  });

  const isBalanceSufficient =
    (currentValues?.amount ?? 0) < (balanceFloat ?? 0);

  const isDisabled =
    !hasChanges || form.formState.isSubmitting || !isBalanceSufficient;

  const isSenderHumanVerified = useIsHuman(walletApi.accountId ?? "unknown");

  const onSubmit: SubmitHandler<DonationInputs> = useCallback(
    (values) => dispatch.donation.submit({ ...values, ...params }),
    [params],
  );

  console.table({ isDisabled, hasChanges });
  console.table(currentValues);
  console.table(defaultValues);

  return {
    hasChanges,
    isBalanceSufficient,
    isDisabled,
    isSenderHumanVerified,
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
