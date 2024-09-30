import { useCallback, useEffect, useMemo } from "react";

import { CheckedState } from "@radix-ui/react-checkbox";
import { UseFormReturn } from "react-hook-form";
import { isNot, isStrictEqual, piped, prop } from "remeda";

import { Pot, potlock } from "@/common/api/potlock";
import { intoShareValue } from "@/common/lib";
import { ByAccountId } from "@/common/types";
import { TOTAL_FEE_BASIS_POINTS } from "@/modules/core/constants";

import { DonationInputs } from "../models";
import {
  DonationBreakdown,
  DonationShareAllocationStrategyEnum,
  WithTotalAmount,
} from "../types";
import { donationFeeBasisPointsToPercents } from "../utils/converters";

export type DonationPotShareAllocationDeps = {
  form: UseFormReturn<DonationInputs>;
};

export const useDonationEvenShareAllocation = ({
  form,
}: WithTotalAmount & DonationPotShareAllocationDeps) => {
  const [amount, potShareAllocationStrategy, potDonationShares = []] =
    form.watch(["amount", "potShareAllocationStrategy", "potDonationShares"]);

  const recipientShareAmount = useMemo(
    () => intoShareValue(amount, potDonationShares.length),
    [amount, potDonationShares.length],
  );

  useEffect(() => {
    if (
      potShareAllocationStrategy ===
        DonationShareAllocationStrategyEnum.evenly &&
      potDonationShares.some(
        piped(prop("amount"), isNot(isStrictEqual(recipientShareAmount))),
      )
    ) {
      form.setValue(
        "potDonationShares",

        potDonationShares.map((recipientShare) => ({
          ...recipientShare,
          amount: recipientShareAmount,
        })),
      );
    }
  }, [
    form,
    potDonationShares,
    potShareAllocationStrategy,
    recipientShareAmount,
  ]);

  return useCallback(
    (recipient: ByAccountId) => {
      const isAssigned = potDonationShares.some(
        ({ account_id }) => account_id === recipient.accountId,
      );

      return (assign: CheckedState) => {
        form.setValue(
          "potDonationShares",

          assign
            ? potDonationShares.concat(
                isAssigned ? [] : [{ account_id: recipient.accountId }],
              )
            : potDonationShares.filter(
                (recipientShare) =>
                  recipientShare.account_id !== recipient.accountId,
              ),
        );
      };
    },

    [form, potDonationShares],
  );
};

export const useDonationManualShareAllocation = ({
  form,
}: DonationPotShareAllocationDeps) => {
  const [potDonationShares = []] = form.watch(["potDonationShares"]);

  return useCallback(
    (recipient: ByAccountId): React.ChangeEventHandler<HTMLInputElement> => {
      const hasAssignedShare = potDonationShares.some(
        ({ account_id }) => account_id === recipient.accountId,
      );

      return ({ target: { value } }) => {
        const recipientShareAmount = parseFloat(value);

        if (hasAssignedShare) {
          form.setValue(
            "potDonationShares",

            potDonationShares.reduce(
              (updatedShares = [], recipientShare) => {
                if (recipientShare.account_id === recipient.accountId) {
                  return recipientShareAmount > 0
                    ? updatedShares.concat([
                        { ...recipientShare, amount: recipientShareAmount },
                      ])
                    : updatedShares;
                } else return updatedShares.concat([recipientShare]);
              },

              [] as DonationInputs["potDonationShares"],
            ),
          );
        } else if (recipientShareAmount > 0) {
          form.setValue(
            "potDonationShares",

            potDonationShares.concat([
              { account_id: recipient.accountId, amount: recipientShareAmount },
            ]),
          );
        }
      };
    },

    [form, potDonationShares],
  );
};

export type DonationAllocationParams = WithTotalAmount &
  Pick<DonationInputs, "referrerAccountId"> &
  Partial<Pick<DonationInputs, "bypassProtocolFee" | "bypassChefFee">> & {
    pot?: Pot;
    protocolFeeFinalAmount?: number;
    referralFeeFinalAmount?: number;
  };

export const useDonationAllocationBreakdown = ({
  totalAmountFloat,
  pot,
  referrerAccountId,
  protocolFeeFinalAmount,
  referralFeeFinalAmount,
  bypassProtocolFee = false,
  bypassChefFee = false,
}: DonationAllocationParams): DonationBreakdown => {
  const { data: potlockDonationConfig } = potlock.useDonationConfig();

  // TODO: (non-critical)
  //? Recalculate basis points if `protocolFeeFinalAmount` and `referralFeeFinalAmount` are provided

  /**
   *? Protocol fee:
   */

  const protocolFeeInitialBasisPoints =
    potlockDonationConfig?.protocol_fee_basis_points ?? 0;

  const protocolFeeBasisPoints = bypassProtocolFee
    ? 0
    : protocolFeeInitialBasisPoints;

  const protocolFeeAmount =
    protocolFeeFinalAmount ??
    (totalAmountFloat * protocolFeeBasisPoints) / TOTAL_FEE_BASIS_POINTS;

  const protocolFeePercent = donationFeeBasisPointsToPercents(
    protocolFeeInitialBasisPoints,
  );

  const protocolFeeRecipientAccountId =
    potlockDonationConfig?.protocol_fee_recipient_account;

  /**
   *? Referral fee:
   */

  const potlockReferralFeeBasisPoints =
    potlockDonationConfig?.referral_fee_basis_points ?? 0;

  const referralFeeInitialBasisPoints =
    pot?.referral_fee_public_round_basis_points ??
    potlockReferralFeeBasisPoints;

  const referralFeeBasisPoints = referrerAccountId
    ? referralFeeInitialBasisPoints
    : 0;

  const referralFeeAmount =
    referralFeeFinalAmount ??
    (totalAmountFloat * referralFeeBasisPoints) / TOTAL_FEE_BASIS_POINTS;

  const referralFeePercent = donationFeeBasisPointsToPercents(
    referralFeeBasisPoints,
  );

  /**
   *? Chef fee:
   */

  const chefFeeInitialBasisPoints =
    typeof pot?.chef?.id === "string" ? pot?.chef_fee_basis_points ?? 0 : 0;

  const chefFeeBasisPoints = bypassChefFee ? 0 : chefFeeInitialBasisPoints;

  const chefFeeAmount =
    (totalAmountFloat * chefFeeBasisPoints) / TOTAL_FEE_BASIS_POINTS;

  const chefFeePercent = donationFeeBasisPointsToPercents(
    chefFeeInitialBasisPoints,
  );

  /**
   *? Project allocation:
   */

  const projectAllocationBasisPoints =
    TOTAL_FEE_BASIS_POINTS -
    protocolFeeBasisPoints -
    chefFeeBasisPoints -
    referralFeeBasisPoints;

  const projectAllocationAmount =
    (totalAmountFloat * projectAllocationBasisPoints) / TOTAL_FEE_BASIS_POINTS;

  const projectAllocationPercent = donationFeeBasisPointsToPercents(
    projectAllocationBasisPoints,
  );

  return {
    projectAllocationAmount,
    projectAllocationPercent,
    protocolFeeAmount,
    protocolFeePercent,
    protocolFeeRecipientAccountId,
    referralFeeAmount,
    referralFeePercent,
    chefFeeAmount,
    chefFeePercent,
  };
};
