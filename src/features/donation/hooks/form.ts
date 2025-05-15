import { useCallback, useEffect, useMemo, useState } from "react";

import { Big } from "big.js";
import { type ErrorOption, SubmitHandler, useWatch } from "react-hook-form";
import { isNonNullish } from "remeda";

import { FEATURE_REGISTRY } from "@/common/_config";
import { PotApplicationStatus, indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_DECIMALS, NATIVE_TOKEN_ID } from "@/common/constants";
import { campaignsContractHooks } from "@/common/contracts/core/campaigns";
import { indivisibleUnitsToFloat, safePositiveNumberOrZero } from "@/common/lib";
import { useEnhancedForm } from "@/common/ui/form/hooks";
import { useToast } from "@/common/ui/layout/hooks";
import { useWalletUserSession } from "@/common/wallet";
import { useToken } from "@/entities/_shared";
import { extractMatchingPots } from "@/entities/pot";
import { dispatch } from "@/store";

import {
  DONATION_DEFAULT_MIN_AMOUNT_FLOAT,
  DONATION_INSUFFICIENT_BALANCE_ERROR,
} from "../constants";
import { DonationInputs, donationDependentFields, donationSchema } from "../models/schemas";
import {
  DonationAllocationKey,
  DonationAllocationStrategyEnum,
  DonationGroupAllocationStrategyEnum,
} from "../types";

export type DonationFormParams = DonationAllocationKey & {
  referrerAccountId?: string;
};

export const useDonationForm = ({ ...params }: DonationFormParams) => {
  const { toast } = useToast();
  const viewer = useWalletUserSession();

  //* Initial conditional parameters depending on donation scenario:
  const isSingleRecipientDonation = "accountId" in params;
  const recipientAccountIdFormParam = isSingleRecipientDonation ? params.accountId : undefined;
  const isCampaignDonation = "campaignId" in params;
  const campaignIdFormParam = isCampaignDonation ? params.campaignId : undefined;
  const isListDonation = "listId" in params;
  const listIdFormParam = isListDonation ? params.listId : undefined;
  const isGroupPotDonation = "potId" in params;
  const groupDonationPotId = isGroupPotDonation ? params.potId : undefined;
  const isGroupDonation = isGroupPotDonation || isListDonation;

  const { data: campaign } = campaignsContractHooks.useCampaign({
    enabled: isCampaignDonation,
    campaignId: campaignIdFormParam ?? 0,
  });

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
      amount: DONATION_DEFAULT_MIN_AMOUNT_FLOAT,
      tokenId: campaign?.ft_id ?? NATIVE_TOKEN_ID,
      recipientAccountId: recipientAccountIdFormParam,
      campaignId: campaignIdFormParam,
      listId: listIdFormParam,
      potAccountId: matchingPots.at(0)?.account ?? groupDonationPotId,

      allocationStrategy:
        isSingleRecipientDonation || isCampaignDonation
          ? DonationAllocationStrategyEnum.full
          : DonationAllocationStrategyEnum.share,

      groupAllocationStrategy: DonationGroupAllocationStrategyEnum.even,
      groupAllocationPlan: isGroupDonation ? [] : undefined,
    }),

    [
      campaign?.ft_id,
      campaignIdFormParam,
      groupDonationPotId,
      isCampaignDonation,
      isGroupDonation,
      isSingleRecipientDonation,
      listIdFormParam,
      matchingPots,
      recipientAccountIdFormParam,
    ],
  );

  const [customErrors, setCustomErrors] = useState<
    Partial<Record<keyof DonationInputs, ErrorOption>> | undefined
  >(undefined);

  const { form: self } = useEnhancedForm({
    schema: donationSchema,
    dependentFields: donationDependentFields,
    mode: "onChange",
    defaultValues,
    resetOptions: { keepDirtyValues: false },
    followDefaultValues: true,
    injectedErrors: customErrors,
  });

  //! For internal use only!
  const values = useWatch({ control: self.control });
  const isFtDonation = (values.tokenId ?? NATIVE_TOKEN_ID) !== NATIVE_TOKEN_ID;

  const parsedAmount = useMemo(
    () => safePositiveNumberOrZero.parse(values.amount),
    [values.amount],
  );

  const isSingleRecipientPotDonation =
    isSingleRecipientDonation &&
    values.allocationStrategy === DonationAllocationStrategyEnum.share &&
    values.potAccountId !== undefined;

  const { data: token } = useToken({
    tokenId: values.tokenId ?? NATIVE_TOKEN_ID,
    balanceCheckAccountId: viewer?.accountId,
  });

  const { data: pot } = indexer.usePot({
    enabled: isGroupPotDonation || isSingleRecipientPotDonation,
    potId: groupDonationPotId ?? values.potAccountId ?? "noop",
  });

  /**
   * Minimum donation amount for each recipient in pot and list donations.
   */
  const minRecipientShareAmountFloat = useMemo(() => {
    if (pot !== undefined) {
      if (FEATURE_REGISTRY.PotFtDonation.isEnabled) {
        return token !== undefined
          ? indivisibleUnitsToFloat(
              pot.min_matching_pool_donation_amount,
              token.metadata.decimals,
              4,
            )
          : DONATION_DEFAULT_MIN_AMOUNT_FLOAT;
      } else {
        return indivisibleUnitsToFloat(
          pot.min_matching_pool_donation_amount,
          NATIVE_TOKEN_DECIMALS,
          4,
        );
      }
    } else return DONATION_DEFAULT_MIN_AMOUNT_FLOAT;
  }, [pot, token]);

  /**
   * Minimum total donation amount in all cases except when group donation is manually allocated.
   */
  const minTotalAmountFloat = useMemo(() => {
    if (
      isGroupDonation &&
      values.groupAllocationStrategy === DonationGroupAllocationStrategyEnum.even
    ) {
      return values.groupAllocationPlan !== undefined && values.groupAllocationPlan.length > 0
        ? parseFloat(
            Big(values.groupAllocationPlan.length)
              .times(minRecipientShareAmountFloat)
              .toFixed(4, 3),
          )
        : undefined;
    } else if (isSingleRecipientPotDonation) {
      return minRecipientShareAmountFloat;
    } else if (isCampaignDonation && token !== undefined) {
      return isNonNullish(campaign?.min_amount)
        ? indivisibleUnitsToFloat(campaign.min_amount, token.metadata.decimals, 4)
        : undefined;
    } else return isFtDonation ? undefined : DONATION_DEFAULT_MIN_AMOUNT_FLOAT;
  }, [
    campaign?.min_amount,
    isCampaignDonation,
    isFtDonation,
    isGroupDonation,
    isSingleRecipientPotDonation,
    minRecipientShareAmountFloat,
    token,
    values.groupAllocationPlan,
    values.groupAllocationStrategy,
  ]);

  const totalAmountFloat =
    (isSingleRecipientDonation || isCampaignDonation
      ? parsedAmount
      : values.groupAllocationPlan
          ?.reduce((total, { amount }) => total.add(amount ?? 0), Big(0))
          .toNumber()) ?? 0.0;

  const isDisabled = useMemo(
    () => !self.formState.isValid || customErrors !== undefined || self.formState.isSubmitting,
    [customErrors, self.formState.isSubmitting, self.formState.isValid],
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

  //* Ensure the correct token is selected:
  useEffect(() => {
    if (isCampaignDonation && isNonNullish(campaign?.ft_id) && values.tokenId !== campaign.ft_id) {
      self.setValue("tokenId", campaign.ft_id);
    } else if (
      (values.allocationStrategy === "full" && values.tokenId === undefined) ||
      (values.allocationStrategy === "share" && values.tokenId === undefined) ||
      (values.allocationStrategy === "share" &&
        !FEATURE_REGISTRY.PotFtDonation.isEnabled &&
        values.tokenId !== NATIVE_TOKEN_ID)
    ) {
      self.setValue("tokenId", NATIVE_TOKEN_ID);
    }
  }, [campaign?.ft_id, isCampaignDonation, self, values.allocationStrategy, values.tokenId]);

  //* Ensure `amount` is populated from `totalAmountFloat` when using manual share allocation:
  useEffect(() => {
    if (
      values.allocationStrategy === "share" &&
      values.groupAllocationStrategy === "manual" &&
      parsedAmount !== totalAmountFloat
    ) {
      self.setValue("amount", totalAmountFloat, { shouldValidate: true });
    }
  }, [
    parsedAmount,
    self,
    totalAmountFloat,
    values.allocationStrategy,
    values.groupAllocationStrategy,
  ]);

  //* Handle complex amount validation
  useEffect(() => {
    //* Only trigger with user input
    if (viewer.hasWalletReady && values.amount !== undefined) {
      //* Checking for insufficient balance
      if (token?.balance !== undefined && token.balance.lt(totalAmountFloat)) {
        if (
          customErrors?.amount?.message !== DONATION_INSUFFICIENT_BALANCE_ERROR ||
          self.formState.isValid
        ) {
          setCustomErrors({ amount: { message: DONATION_INSUFFICIENT_BALANCE_ERROR } });
        }
      }

      //* Addressing single-recipient and group donation scenarios with evenly distributed funds
      else if (
        minTotalAmountFloat !== undefined &&
        Big(parsedAmount).lt(minTotalAmountFloat) &&
        (values.allocationStrategy === DonationAllocationStrategyEnum.full ||
          (values.allocationStrategy === DonationAllocationStrategyEnum.share &&
            values.groupAllocationStrategy === DonationGroupAllocationStrategyEnum.even))
      ) {
        const errorMessage = `Cannot be less than ${minTotalAmountFloat} ${(isFtDonation
          ? (token?.metadata.symbol ?? "")
          : NATIVE_TOKEN_ID
        ).toUpperCase()}.`;

        if (customErrors?.amount?.message !== errorMessage || self.formState.isValid) {
          setCustomErrors({ amount: { message: errorMessage } });
        }
      }

      //* Addressing group donation scenarios with manually distributed funds
      else if (
        values.allocationStrategy === DonationAllocationStrategyEnum.share &&
        values.groupAllocationStrategy === DonationGroupAllocationStrategyEnum.manual &&
        (values.groupAllocationPlan?.some(
          ({ amount }) => amount !== undefined && amount < minRecipientShareAmountFloat,
        ) ??
          false)
      ) {
        const errorMessage = `Each selected recipient must get at least ${
          minRecipientShareAmountFloat
        } ${(isFtDonation ? (token?.metadata.symbol ?? "") : NATIVE_TOKEN_ID).toUpperCase()}.`;

        if (customErrors?.amount?.message !== errorMessage || self.formState.isValid) {
          setCustomErrors({ amount: { message: errorMessage } });
        }
      }

      //* Resetting amount errors
      else if (customErrors !== undefined) {
        setCustomErrors(undefined);
        self.clearErrors("amount");
      }
    }
  }, [
    customErrors,
    isFtDonation,
    isGroupDonation,
    minRecipientShareAmountFloat,
    minTotalAmountFloat,
    parsedAmount,
    self,
    self.formState.errors,
    self.formState.isValid,
    token?.balance,
    token?.metadata.decimals,
    token?.metadata.symbol,
    totalAmountFloat,
    values.allocationStrategy,
    values.amount,
    values.groupAllocationPlan,
    values.groupAllocationStrategy,
    viewer.hasWalletReady,
  ]);

  return {
    form: self,
    defaultValues,
    isDisabled,
    onSubmit: self.handleSubmit(onSubmit),
    matchingPots,
    minTotalAmountFloat,
    isGroupDonation,
    // TODO: Likely not needed to be exposed anymore, try using `amount` everywhere
    // TODO: in the consuming code instead and remove this if no issues detected.
    totalAmountFloat,
  };
};
