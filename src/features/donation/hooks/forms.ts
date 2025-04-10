import { useCallback, useEffect, useMemo } from "react";

import { Big } from "big.js";
import { SubmitHandler, useWatch } from "react-hook-form";
import { Temporal } from "temporal-polyfill";

import { PotApplicationStatus, indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { oldToRecent } from "@/common/lib";
import { useEnhancedForm } from "@/common/ui/form/hooks";
import { useWalletUserSession } from "@/common/wallet";
import { dispatch } from "@/store";

import { DONATION_MIN_NEAR_AMOUNT, DONATION_MIN_NEAR_AMOUNT_ERROR } from "../constants";
import { DonationInputs, donationDependentFields, donationSchema } from "../models";
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

  const defaultMatchingPotAccountId = useMemo(
    () =>
      isSingleProjectDonation
        ? undefined
        : oldToRecent("matching_round_end", matchingPots).at(0)?.account,

    [isSingleProjectDonation, matchingPots],
  );

  const defaultValues = useMemo<Partial<DonationInputs>>(
    () => ({
      amount: DONATION_MIN_NEAR_AMOUNT,
      tokenId: NATIVE_TOKEN_ID,
      recipientAccountId,
      potAccountId: isPotDonation ? potAccountId : defaultMatchingPotAccountId,
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
      campaignId,
      defaultMatchingPotAccountId,
      isCampaignDonation,
      isPotDonation,
      isSingleProjectDonation,
      listId,
      matchingPots.length,
      potAccountId,
      recipientAccountId,
    ],
  );

  const { form: self } = useEnhancedForm({
    schema: donationSchema,
    dependentFields: donationDependentFields,
    mode: "all",
    defaultValues,
    followDefaultValues: true,
    resetOptions: { keepDirtyValues: false },
  });

  //? For internal use only!
  const values = useWatch({ control: self.control });
  const amount = values.amount ?? 0;
  const tokenId = values.tokenId ?? NATIVE_TOKEN_ID;

  const totalAmountFloat =
    (isSingleProjectDonation || isCampaignDonation
      ? amount
      : values.groupAllocationPlan
          ?.reduce((total, { amount }) => total.add(amount ?? 0), Big(0))
          .toNumber()) ?? 0.0;

  const isDisabled = useMemo(
    () => !self.formState.isValid || self.formState.isSubmitting,
    [self.formState.isSubmitting, self.formState.isValid],
  );

  const minAmountError = useMemo(
    () =>
      !isDonationAmountSufficient({ amount, tokenId }) && viewer.hasWalletReady
        ? DONATION_MIN_NEAR_AMOUNT_ERROR
        : null,

    [amount, tokenId, viewer.hasWalletReady],
  );

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
    if (
      (values.allocationStrategy === "full" && values.tokenId === undefined) ||
      (values.allocationStrategy === "share" && values.tokenId !== NATIVE_TOKEN_ID)
    ) {
      self.setValue("tokenId", NATIVE_TOKEN_ID, { shouldDirty: true, shouldTouch: true });
    }
  }, [self, values]);

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
