import { useCallback, useEffect, useMemo } from "react";

import { CheckedState } from "@radix-ui/react-checkbox";
import { isNot, isStrictEqual, piped, prop } from "remeda";

import { Pot, indexer } from "@/common/api/indexer";
import { intoShareValue } from "@/common/lib";
import { ByAccountId } from "@/common/types";
import { TOTAL_FEE_BASIS_POINTS } from "@/modules/core/constants";

import { DonationInputs, WithDonationFormAPI } from "../models";
import {
  DonationBreakdown,
  DonationGroupAllocationStrategyEnum,
  WithTotalAmount,
} from "../types";
import { donationFeeBasisPointsToPercents } from "../utils/converters";

export type DonationShareAllocationDeps = WithDonationFormAPI;

export const useDonationEvenShareAllocation = ({
  form,
}: DonationShareAllocationDeps) => {
  const [amount, groupAllocationStrategy, groupAllocationPlan = []] =
    form.watch(["amount", "groupAllocationStrategy", "groupAllocationPlan"]);

  const recipientShareAmount = useMemo(
    () => intoShareValue(amount, groupAllocationPlan.length),
    [amount, groupAllocationPlan.length],
  );

  useEffect(() => {
    if (
      groupAllocationStrategy === DonationGroupAllocationStrategyEnum.evenly &&
      groupAllocationPlan.some(
        piped(prop("amount"), isNot(isStrictEqual(recipientShareAmount))),
      )
    ) {
      form.setValue(
        "groupAllocationPlan",

        groupAllocationPlan.map((recipientShare) => ({
          ...recipientShare,
          amount: recipientShareAmount,
        })),

        { shouldDirty: true },
      );
    }
  }, [
    form,
    groupAllocationPlan,
    groupAllocationStrategy,
    recipientShareAmount,
  ]);

  return useCallback(
    (recipient: ByAccountId) => {
      const isAssigned = groupAllocationPlan.some(
        ({ account_id }) => account_id === recipient.accountId,
      );

      return (assign: CheckedState) => {
        form.setValue(
          "groupAllocationPlan",

          assign
            ? groupAllocationPlan.concat(
                isAssigned ? [] : [{ account_id: recipient.accountId }],
              )
            : groupAllocationPlan.filter(
                (recipientShare) =>
                  recipientShare.account_id !== recipient.accountId,
              ),

          { shouldDirty: true },
        );
      };
    },

    [form, groupAllocationPlan],
  );
};

export const useDonationManualShareAllocation = ({
  form,
}: DonationShareAllocationDeps) => {
  const [groupAllocationPlan = []] = form.watch(["groupAllocationPlan"]);

  return useCallback(
    (recipient: ByAccountId): React.ChangeEventHandler<HTMLInputElement> => {
      const hasAssignedShare = groupAllocationPlan.some(
        ({ account_id }) => account_id === recipient.accountId,
      );

      return ({ target: { value } }) => {
        const recipientShareAmount = parseFloat(value);

        if (hasAssignedShare) {
          form.setValue(
            "groupAllocationPlan",

            groupAllocationPlan.reduce(
              (updatedShares = [], recipientShare) => {
                if (recipientShare.account_id === recipient.accountId) {
                  return recipientShareAmount > 0
                    ? updatedShares.concat([
                        { ...recipientShare, amount: recipientShareAmount },
                      ])
                    : updatedShares;
                } else return updatedShares.concat([recipientShare]);
              },

              [] as DonationInputs["groupAllocationPlan"],
            ),
          );
        } else if (recipientShareAmount > 0) {
          form.setValue(
            "groupAllocationPlan",

            groupAllocationPlan.concat([
              { account_id: recipient.accountId, amount: recipientShareAmount },
            ]),
          );
        }
      };
    },

    [form, groupAllocationPlan],
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
  const { data: potlockDonationConfig } = indexer.useDonationConfig();

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
    typeof pot?.chef?.id === "string" ? (pot?.chef_fee_basis_points ?? 0) : 0;

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
