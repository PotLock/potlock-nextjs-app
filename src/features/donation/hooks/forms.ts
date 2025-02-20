import { useCallback, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { entries } from "remeda";
import { Temporal } from "temporal-polyfill";
import { ZodError } from "zod";

import { PotApplicationStatus, indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { oldToRecent } from "@/common/lib";
import { useWalletUserSession } from "@/common/wallet";
import { dispatch } from "@/store";

import { DONATION_MIN_NEAR_AMOUNT, DONATION_MIN_NEAR_AMOUNT_ERROR } from "../constants";
import { DonationInputs, donationCrossFieldValidationTargets, donationSchema } from "../models";
import {
  DonationAllocationKey,
  DonationAllocationStrategyEnum,
  DonationGroupAllocationStrategyEnum,
} from "../types";
import { isDonationAmountSufficient } from "../utils/validation";

export type DonationFormParams = DonationAllocationKey & {
  referrerAccountId?: string;
};

export const useDonationForm = ({ ...params }: DonationFormParams) => {
  const viewer = useWalletUserSession();
  const now = Temporal.Now.instant();
  const isSingleProjectDonation = "accountId" in params;
  const isPotDonation = "potId" in params;
  const isListDonation = "listId" in params;
  const isCampaignDonation = "campaignId" in params;
  const potAccountId = isPotDonation ? params.potId : undefined;
  const listId = isListDonation ? params.listId : undefined;
  const campaignId = isCampaignDonation ? params.campaignId : undefined;
  const recipientAccountId = isSingleProjectDonation ? params.accountId : undefined;

  const { data: recipientActivePots = [] } = indexer.useAccountActivePots({
    accountId: recipientAccountId,
    status: PotApplicationStatus.Approved,
    page_size: 999,
  });

  const matchingPots = recipientActivePots.filter(
    ({ matching_round_start, matching_round_end }) =>
      now.since(Temporal.Instant.from(matching_round_start)).total("milliseconds") > 0 &&
      now.until(Temporal.Instant.from(matching_round_end)).total("milliseconds") > 0,
  );

  const defaultPotAccountId = useMemo(
    () => oldToRecent("matching_round_end", matchingPots).at(0)?.account,
    [matchingPots],
  );

  const defaultValues = useMemo<Partial<DonationInputs>>(
    () => ({
      amount: DONATION_MIN_NEAR_AMOUNT,
      tokenId: NATIVE_TOKEN_ID,
      recipientAccountId,
      potAccountId: isPotDonation ? potAccountId : defaultPotAccountId,
      listId,
      campaignId,

      allocationStrategy:
        isSingleProjectDonation || isCampaignDonation
          ? DonationAllocationStrategyEnum[
              !isCampaignDonation && matchingPots.length > 0 ? "share" : "full"
            ]
          : DonationAllocationStrategyEnum.share,

      groupAllocationStrategy: DonationGroupAllocationStrategyEnum.evenly,
    }),

    [
      defaultPotAccountId,
      isPotDonation,
      isSingleProjectDonation,
      isCampaignDonation,
      listId,
      campaignId,
      matchingPots.length,
      potAccountId,
      recipientAccountId,
    ],
  );

  const self = useForm<DonationInputs>({
    resolver: zodResolver(donationSchema),
    mode: "all",
    defaultValues,
    resetOptions: { keepDirtyValues: false },
  });

  const values = useWatch({ control: self.control });
  const amount = values.amount ?? 0;
  const tokenId = values.tokenId ?? NATIVE_TOKEN_ID;

  const totalAmountFloat =
    isSingleProjectDonation || isCampaignDonation
      ? amount
      : (values.groupAllocationPlan?.reduce((total, { amount }) => total + (amount ?? 0.0), 0.0) ??
        0.0);

  const [crossFieldErrors, setCrossFieldErrors] = useState<FieldErrors<DonationInputs>>({});

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
      entries(values).some(([key, value]) => value !== defaultValues[key as keyof DonationInputs]),

    [defaultValues, values],
  );

  const isDisabled = !self.formState.isValid || self.formState.isSubmitting;

  const minAmountError =
    !isDonationAmountSufficient({ amount, tokenId }) && hasChanges
      ? DONATION_MIN_NEAR_AMOUNT_ERROR
      : null;

  const onSubmit: SubmitHandler<DonationInputs> = useCallback(
    (inputs) =>
      dispatch.donation.submit({
        ...inputs,
        ...params,
        referrerAccountId: viewer?.referrerAccountId,
      }),

    [params, viewer?.referrerAccountId],
  );

  useEffect(() => {
    /**
     *? Due to yet undetermined issue, when `defaultPotAccountId` gets defined,
     *?  it does not trigger the form state update, so we have to do it manually.
     */
    if (
      isSingleProjectDonation &&
      values.potAccountId === undefined &&
      defaultPotAccountId !== undefined
    ) {
      self.setValue("potAccountId", defaultPotAccountId);
    }
  }, [values, defaultPotAccountId, self, hasChanges, params, isSingleProjectDonation]);

  useEffect(() => {
    if (
      (values.allocationStrategy === "full" && values.tokenId === undefined) ||
      (values.allocationStrategy === "share" && values.tokenId !== NATIVE_TOKEN_ID)
    ) {
      self.setValue("tokenId", NATIVE_TOKEN_ID, { shouldDirty: true, shouldTouch: true });
    }
  }, [self, values]);

  /**
   * Patched form object with cross-field validation errors included.
   */
  const form = useMemo(
    () => ({
      ...self,

      formState: {
        ...self.formState,
        errors: { ...self.formState.errors, ...crossFieldErrors },
      },
    }),

    [crossFieldErrors, self],
  );

  return {
    form,
    defaultValues,
    hasChanges,
    isDisabled,
    onSubmit: self.handleSubmit(onSubmit),
    matchingPots,
    minAmountError,
    totalAmountFloat,
  };
};
