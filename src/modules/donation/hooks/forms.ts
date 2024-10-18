import { useCallback, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { entries } from "remeda";
import { ZodError } from "zod";

import { walletApi } from "@/common/api/near";
import { StatusF24Enum, potlock } from "@/common/api/potlock";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { toChronologicalOrder } from "@/common/lib";
import { useIsHuman } from "@/modules/core";
import { useTokenBalance } from "@/modules/token";
import { dispatch } from "@/store";

import {
  DONATION_MIN_NEAR_AMOUNT,
  DONATION_MIN_NEAR_AMOUNT_ERROR,
} from "../constants";
import {
  DonationInputs,
  donationCrossFieldValidationTargets,
  donationSchema,
  donationTokenSchema,
} from "../models";
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
  const isListDonation = "listId" in params;
  const potAccountId = isPotDonation ? params.potId : undefined;
  const listId = isListDonation ? params.listId : undefined;

  const recipientAccountId = isSingleProjectDonation
    ? params.accountId
    : undefined;

  const { data: matchingPotsPaginated } = potlock.useAccountActivePots({
    accountId: recipientAccountId,
    status: StatusF24Enum.Approved,
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
      potAccountId: isPotDonation ? potAccountId : defaultPotAccountId,
      listId,

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
      listId,
      matchingPots.length,
      potAccountId,
      recipientAccountId,
      referrerAccountId,
    ],
  );

  const self = useForm<DonationInputs>({
    resolver: zodResolver(donationSchema),
    mode: "all",
    defaultValues,
    resetOptions: { keepDirtyValues: false },
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

  const [crossFieldErrors, setCrossFieldErrors] = useState<
    FieldErrors<DonationInputs>
  >({});

  useEffect(
    () =>
      void donationSchema
        .parseAsync(values as DonationInputs)
        .then(() => setCrossFieldErrors({}))
        .catch((error: ZodError) =>
          setCrossFieldErrors(
            error?.issues.reduce((schemaErrors, { code, message, path }) => {
              const fieldPath = path.at(0);

              return donationCrossFieldValidationTargets.includes(
                fieldPath as keyof DonationInputs,
              ) &&
                typeof fieldPath === "string" &&
                code === "custom"
                ? { ...schemaErrors, [fieldPath]: { message, type: code } }
                : schemaErrors;
            }, {}),
          ),
        ),

    [values],
  );

  const hasChanges = useMemo(
    () =>
      entries(values).some(
        ([key, value]) => value !== defaultValues[key as keyof DonationInputs],
      ),

    [defaultValues, values],
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
      defaultPotAccountId !== undefined
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

  console.log(values.groupAllocationPlan);

  console.table({ hasChanges, isValid: self.formState.isValid });

  console.log(JSON.stringify(self.formState, null, 2));

  return {
    form: {
      ...self,

      formState: {
        ...self.formState,
        errors: { ...self.formState.errors, ...crossFieldErrors },
      },
    },

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
