import { useCallback, useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { omit } from "remeda";

import { walletApi } from "@/common/api/near";
import { PotApplicationStatusEnum, potlock } from "@/common/api/potlock";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { toChronologicalOrder } from "@/common/lib";
import { useAvailableBalance } from "@/modules/core";
import useIsHuman from "@/modules/core/hooks/useIsHuman";
import { dispatch } from "@/store";

import {
  DONATION_MIN_NEAR_AMOUNT,
  DONATION_MIN_NEAR_AMOUNT_ERROR,
} from "../constants";
import { DonationInputs, donationSchema, donationTokenSchema } from "../models";
import {
  DonationAllocationKey,
  DonationAllocationStrategyEnum,
  DonationShareAllocationStrategyEnum,
} from "../types";
import { isDonationAmountSufficient } from "../utils/validation";

export type DonationFormParams = DonationAllocationKey & {
  referrerAccountId?: string;
};

export const useDonationForm = ({
  referrerAccountId,
  ...params
}: DonationFormParams) => {
  const recipientAccountId =
    "accountId" in params ? params.accountId : undefined;

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

      allocationStrategy:
        "accountId" in params
          ? DonationAllocationStrategyEnum[
              matchingPots.length > 0 ? "pot" : "direct"
            ]
          : DonationAllocationStrategyEnum.pot,

      tokenId: donationTokenSchema.parse(undefined),
      recipientAccountId,
      referrerAccountId,
      potAccountId: "potId" in params ? params.potId : defaultPotAccountId,

      potShareAllocationStrategy:
        DonationShareAllocationStrategyEnum[
          "accountId" in params ? "manually" : "evenly"
        ],
    }),

    [
      defaultPotAccountId,
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
  const { balanceFloat } = useAvailableBalance({ tokenId });

  const totalAmountFloat =
    values.allocationStrategy === DonationAllocationStrategyEnum.pot
      ? values.potDonationShares?.reduce(
          (total, { amount }) => total + (amount ?? 0),
          0,
        ) ?? 0
      : amount;

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
      "accountId" in params &&
      values.potAccountId === undefined &&
      defaultPotAccountId
    ) {
      self.setValue("potAccountId", defaultPotAccountId);
    }
  }, [values, defaultPotAccountId, self, hasChanges, params]);

  console.table(omit(values, ["potDonationShares"]));

  values.potDonationShares?.forEach((entry) => console.table(entry));

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
