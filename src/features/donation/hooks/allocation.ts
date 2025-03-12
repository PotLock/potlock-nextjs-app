import { useCallback, useEffect, useMemo } from "react";

import { CheckedState } from "@radix-ui/react-checkbox";
import { Big } from "big.js";
import { isNot, isStrictEqual, piped, prop } from "remeda";

import { Pot, indexer } from "@/common/api/indexer";
import { TOTAL_FEE_BASIS_POINTS } from "@/common/constants";
import { deriveShare } from "@/common/lib";
import { ByAccountId } from "@/common/types";
import { useWalletUserSession } from "@/common/wallet";

import { DonationInputs, DonationSubmitParams, WithDonationFormAPI } from "../models";
import { DonationBreakdown, DonationGroupAllocationStrategyEnum, WithTotalAmount } from "../types";
import { donationFeeBasisPointsToPercents } from "../utils/converters";

export type DonationShareAllocationDeps = WithDonationFormAPI;

export const useDonationEvenShareAllocation = ({ form }: DonationShareAllocationDeps) => {
  const [amount, groupAllocationStrategy, groupAllocationPlan = []] = form.watch([
    "amount",
    "groupAllocationStrategy",
    "groupAllocationPlan",
  ]);

  const recipientShareAmount = useMemo(
    () => deriveShare(amount, groupAllocationPlan.length),
    [amount, groupAllocationPlan.length],
  );

  useEffect(() => {
    if (
      groupAllocationStrategy === DonationGroupAllocationStrategyEnum.evenly &&
      groupAllocationPlan.some(piped(prop("amount"), isNot(isStrictEqual(recipientShareAmount))))
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
  }, [form, groupAllocationPlan, groupAllocationStrategy, recipientShareAmount]);

  return useCallback(
    (recipient: ByAccountId) => {
      const isAssigned = groupAllocationPlan.some(
        ({ account_id }) => account_id === recipient.accountId,
      );

      return (assign: CheckedState) => {
        form.setValue(
          "groupAllocationPlan",

          assign
            ? groupAllocationPlan.concat(isAssigned ? [] : [{ account_id: recipient.accountId }])
            : groupAllocationPlan.filter(
                (recipientShare) => recipientShare.account_id !== recipient.accountId,
              ),

          { shouldDirty: true },
        );
      };
    },

    [form, groupAllocationPlan],
  );
};

export const useDonationManualShareAllocation = ({ form }: DonationShareAllocationDeps) => {
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
                    ? updatedShares.concat([{ ...recipientShare, amount: recipientShareAmount }])
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
  Partial<
    Pick<DonationSubmitParams, "bypassProtocolFee" | "bypassChefFee" | "referrerAccountId">
  > & {
    pot?: Pot;
    protocolFeeFinalAmount?: number;
    referralFeeFinalAmount?: number;
  };

export const useDonationAllocationBreakdown = ({
  referrerAccountId,
  totalAmountFloat,
  pot,
  protocolFeeFinalAmount,
  referralFeeFinalAmount,
  bypassProtocolFee = false,
  bypassChefFee = false,
}: DonationAllocationParams): DonationBreakdown => {
  const viewer = useWalletUserSession();
  const { data: donationConfig } = indexer.useDonationConfig();
  const totalAmountBig = Big(totalAmountFloat);

  // TODO: (non-critical)
  //? Recalculate basis points if `protocolFeeFinalAmount` and `referralFeeFinalAmount` are provided

  /**
   *? Protocol fee:
   */

  const protocolFeeInitialBasisPoints = donationConfig?.protocol_fee_basis_points ?? 0;

  const protocolFeeBasisPoints = bypassProtocolFee ? 0 : protocolFeeInitialBasisPoints;

  const protocolFeeAmount =
    protocolFeeFinalAmount ??
    totalAmountBig.times(protocolFeeBasisPoints).div(TOTAL_FEE_BASIS_POINTS).toNumber();

  const protocolFeePercent = donationFeeBasisPointsToPercents(protocolFeeInitialBasisPoints);

  const protocolFeeRecipientAccountId = donationConfig?.protocol_fee_recipient_account;

  /**
   *? Referral fee:
   */

  const initialReferralFeeBasisPoints = donationConfig?.referral_fee_basis_points ?? 0;

  const referralFeeBasisPoints =
    (viewer.referrerAccountId ?? referrerAccountId)
      ? (pot?.referral_fee_public_round_basis_points ?? initialReferralFeeBasisPoints)
      : 0;

  const referralFeeAmount =
    referralFeeFinalAmount ??
    totalAmountBig.times(referralFeeBasisPoints).div(TOTAL_FEE_BASIS_POINTS).toNumber();

  const referralFeePercent = donationFeeBasisPointsToPercents(referralFeeBasisPoints);

  /**
   *? Chef fee:
   */

  const chefFeeInitialBasisPoints =
    typeof pot?.chef?.id === "string" ? (pot?.chef_fee_basis_points ?? 0) : 0;

  const chefFeeBasisPoints = bypassChefFee ? 0 : chefFeeInitialBasisPoints;

  const chefFeeAmount = totalAmountBig
    .times(chefFeeBasisPoints)
    .div(TOTAL_FEE_BASIS_POINTS)
    .toNumber();

  const chefFeePercent = donationFeeBasisPointsToPercents(chefFeeInitialBasisPoints);

  /**
   *? Project allocation:
   */

  const projectAllocationBasisPoints =
    TOTAL_FEE_BASIS_POINTS - protocolFeeBasisPoints - chefFeeBasisPoints - referralFeeBasisPoints;

  const projectAllocationAmount = totalAmountBig
    .times(projectAllocationBasisPoints)
    .div(TOTAL_FEE_BASIS_POINTS)
    .toNumber();

  const projectAllocationPercent = donationFeeBasisPointsToPercents(projectAllocationBasisPoints);

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
