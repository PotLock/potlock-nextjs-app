import { useCallback, useEffect, useMemo } from "react";

import { Big } from "big.js";
import { SubmitHandler, useWatch } from "react-hook-form";

import { FEATURE_REGISTRY } from "@/common/_config";
import { PotApplicationStatus, indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { useEnhancedForm } from "@/common/ui/form/hooks";
import { useToast } from "@/common/ui/layout/hooks";
import { useWalletUserSession } from "@/common/wallet";
import { extractMatchingPots } from "@/entities/pot";
import { dispatch } from "@/store";

import { DONATION_MIN_NEAR_AMOUNT, DONATION_MIN_NEAR_AMOUNT_ERROR } from "../constants";
import { DonationInputs, donationDependentFields, donationSchema } from "../models/schemas";
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
  const { toast } = useToast();
  const viewer = useWalletUserSession();

  //? Conditional parameters depending on donation scenario
  const isSingleRecipientDonation = "accountId" in params;
  const recipientAccountIdFormParam = isSingleRecipientDonation ? params.accountId : undefined;
  const isCampaignDonation = "campaignId" in params;
  const campaignIdFormParam = isCampaignDonation ? params.campaignId : undefined;
  const isListDonation = "listId" in params;
  const listIdFormParam = isListDonation ? params.listId : undefined;

  const { data: recipientActivePots = [] } = indexer.useAccountActivePots({
    enabled: isSingleRecipientDonation,
    accountId: recipientAccountIdFormParam ?? "noop",
    status: PotApplicationStatus.Approved,
    page_size: 999,
  });

  const matchingPots = useMemo(
    () => extractMatchingPots(recipientActivePots),
    [recipientActivePots],
  );

  const defaultValues = useMemo<Partial<DonationInputs>>(
    () => ({
      amount: DONATION_MIN_NEAR_AMOUNT,
      tokenId: NATIVE_TOKEN_ID,
      recipientAccountId: recipientAccountIdFormParam,
      campaignId: campaignIdFormParam,
      listId: listIdFormParam,
      potAccountId: matchingPots.at(0)?.account,

      allocationStrategy:
        isSingleRecipientDonation || isCampaignDonation
          ? DonationAllocationStrategyEnum.full
          : DonationAllocationStrategyEnum.share,

      groupAllocationStrategy: DonationGroupAllocationStrategyEnum.even,
    }),

    [
      campaignIdFormParam,
      isCampaignDonation,
      isSingleRecipientDonation,
      listIdFormParam,
      matchingPots,
      recipientAccountIdFormParam,
    ],
  );

  const { form: self } = useEnhancedForm({
    schema: donationSchema,
    dependentFields: donationDependentFields,
    mode: "all",
    defaultValues,
    resetOptions: { keepDirtyValues: false },
    followDefaultValues: true,
  });

  //? For internal use only!
  const values = useWatch({ control: self.control });
  const amount = values.amount ?? 0;
  const tokenId = values.tokenId ?? NATIVE_TOKEN_ID;

  const totalAmountFloat =
    (isSingleRecipientDonation || isCampaignDonation
      ? amount
      : values.groupAllocationPlan
          ?.reduce((total, { amount }) => total.add(amount ?? 0), Big(0))
          .toNumber()) ?? 0.0;

  const isDisabled = useMemo(
    () => !self.formState.isValid || self.formState.isSubmitting,
    [self.formState.isSubmitting, self.formState.isValid],
  );

  // TODO: Each pot donation share must be validated against `min_matching_pool_donation_amount`
  const minAmountError = useMemo(
    () =>
      !isDonationAmountSufficient({ amount, tokenId }) && viewer.hasWalletReady
        ? DONATION_MIN_NEAR_AMOUNT_ERROR
        : null,

    [amount, tokenId, viewer.hasWalletReady],
  );

  const onSubmitError = useCallback(
    (error: Error) =>
      toast({
        title: "Unable to submit donation",
        description: error.message,
        variant: "destructive",
      }),

    [toast],
  );

  const onSubmit: SubmitHandler<DonationInputs> = useCallback(
    (inputs) =>
      dispatch.donation.submit({
        ...inputs,
        ...params,
        referrerAccountId: viewer?.referrerAccountId,
        onError: onSubmitError,
      }),

    [onSubmitError, params, viewer?.referrerAccountId],
  );

  //? Ensure the correct token is selected
  useEffect(() => {
    if (
      (values.allocationStrategy === "full" && values.tokenId === undefined) ||
      (values.allocationStrategy === "share" && values.tokenId === undefined) ||
      (values.allocationStrategy === "share" &&
        !FEATURE_REGISTRY.PotFtDonation.isEnabled &&
        values.tokenId !== NATIVE_TOKEN_ID)
    ) {
      self.setValue("tokenId", NATIVE_TOKEN_ID, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [self, values.allocationStrategy, values.tokenId]);

  //? Ensure `amount` is populated from `totalAmountFloat` when using manual share allocation
  useEffect(() => {
    if (
      values.allocationStrategy === "share" &&
      values.groupAllocationStrategy === "manual" &&
      values.amount !== totalAmountFloat
    ) {
      self.setValue("amount", totalAmountFloat, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [
    self,
    totalAmountFloat,
    values.allocationStrategy,
    values.amount,
    values.groupAllocationStrategy,
  ]);

  return {
    form: self,
    defaultValues,
    isDisabled,
    onSubmit: self.handleSubmit(onSubmit),
    matchingPots,
    minAmountError,
    totalAmountFloat,
  };
};
