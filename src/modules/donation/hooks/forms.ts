import { useCallback, useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { omit } from "remeda";

import { walletApi } from "@/common/api/near";
import { PotApplicationStatusEnum, potlock } from "@/common/api/potlock";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { toChronologicalOrder } from "@/common/lib";
import { useIsHuman } from "@/modules/core";
import { useTokenBalance } from "@/modules/token";
import { dispatch } from "@/store";

import {
  DONATION_MIN_NEAR_AMOUNT,
  DONATION_MIN_NEAR_AMOUNT_ERROR,
} from "../constants";
import { DonationInputs, donationSchema, donationTokenSchema } from "../models";
import {
  DonationAllocationKey,
  DonationAllocationStrategyEnum,
  DonationGroupAllocationStrategyEnum,
} from "../types";
import { isDonationAmountSufficient } from "../utils/validation";

export type DonationFormParams = DonationAllocationKey & {
  referrerAccountId?: string;
};

export const useDonationForm = ({
  referrerAccountId,
  ...params
}: DonationFormParams) => {
  const isSingleProjectDonation = "accountId" in params;
  const isPotDonation = "potId" in params;

  const recipientAccountId = isSingleProjectDonation
    ? params.accountId
    : undefined;

  const { data: matchingPotsPaginated } = potlock.useAccountActivePots({
    accountId: recipientAccountId,
    status: PotApplicationStatusEnum.Approved,
  });

  const matchingPots = matchingPotsPaginated?.results ?? [];

  const defaultPotAccountId = toChronologicalOrder(
    "matching_round_end",
    matchingPots,
  ).at(0)?.account;

  const defaultValues = useMemo<Partial<DonationInputs>>(
    () => ({
      amount: DONATION_MIN_NEAR_AMOUNT,
      tokenId: donationTokenSchema.parse(undefined),
      recipientAccountId,
      referrerAccountId,
      potAccountId: isPotDonation ? params.potId : defaultPotAccountId,

      allocationStrategy: isSingleProjectDonation
        ? DonationAllocationStrategyEnum[
            matchingPots.length > 0 ? "split" : "full"
          ]
        : DonationAllocationStrategyEnum.split,

      groupAllocationStrategy:
        DonationGroupAllocationStrategyEnum[
          isSingleProjectDonation ? "manually" : "evenly"
        ],
    }),

    [
      defaultPotAccountId,
      isPotDonation,
      isSingleProjectDonation,
      matchingPots.length,
      params,
      recipientAccountId,
      referrerAccountId,
    ],
  );

  const self = useForm<DonationInputs>({
    resolver: zodResolver(donationSchema),
    mode: "onChange",
    defaultValues,
    resetOptions: { keepDirtyValues: true },
  });

  const values = useWatch(self);
  const amount = values.amount ?? 0;
  const tokenId = values.tokenId ?? NEAR_TOKEN_DENOM;
  const { balanceFloat } = useTokenBalance({ tokenId });

  const totalAmountFloat = isSingleProjectDonation
    ? amount
    : (values.groupAllocationPlan?.reduce(
        (total, { amount }) => total + (amount ?? 0.0),
        0.0,
      ) ?? 0.0);

  const hasChanges = Object.keys(values).some(
    (key) =>
      values[key as keyof DonationInputs] !==
      defaultValues[key as keyof DonationInputs],
  );

  const isBalanceSufficient = totalAmountFloat < (balanceFloat ?? 0);

  const isDisabled =
    !hasChanges ||
    !self.formState.isValid ||
    self.formState.isSubmitting ||
    !isBalanceSufficient;

  const isSenderHumanVerified = useIsHuman(walletApi.accountId ?? "unknown");

  const minAmountError =
    !isDonationAmountSufficient({ amount, tokenId }) && hasChanges
      ? DONATION_MIN_NEAR_AMOUNT_ERROR
      : null;

  const onSubmit: SubmitHandler<DonationInputs> = useCallback(
    (inputs) => dispatch.donation.submit({ ...inputs, ...params }),
    [params],
  );

  useEffect(() => {
    /**
     *? Currently, when `defaultPotAccountId` gets determined,
     *?  it does not trigger rerender, so we have to do it manually.
     */
    if (
      isSingleProjectDonation &&
      values.potAccountId === undefined &&
      defaultPotAccountId
    ) {
      self.setValue("potAccountId", defaultPotAccountId);
    }
  }, [
    values,
    defaultPotAccountId,
    self,
    hasChanges,
    params,
    isSingleProjectDonation,
  ]);

  console.table(omit(values, ["groupAllocationPlan"]));

  values.groupAllocationPlan?.forEach((entry) => console.table(entry));

  return {
    form: self,
    defaultValues,
    hasChanges,
    isBalanceSufficient,
    isDisabled,
    isSenderHumanVerified,
    onSubmit: self.handleSubmit(onSubmit),
    matchingPots,
    minAmountError,
    inputs: values,
    totalAmountFloat,
  };
};
