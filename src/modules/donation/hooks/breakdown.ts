import { Pot, potlock } from "@/common/api/potlock";
import { TOTAL_FEE_BASIS_POINTS } from "@/modules/core/constants";

import { DonationInputs } from "../models";
import { DonationBreakdown, WithTotalAmount } from "../types";
import { donationFeeBasisPointsToPercents } from "../utils/converters";

export type DonationPlanProps = WithTotalAmount &
  Pick<DonationInputs, "referrerAccountId"> &
  Partial<Pick<DonationInputs, "bypassProtocolFee" | "bypassChefFee">> & {
    pot?: Pot;
    protocolFeeFinalAmount?: number;
    referralFeeFinalAmount?: number;
  };

export const useDonationBreakdown = ({
  totalAmountFloat,
  pot,
  referrerAccountId,
  protocolFeeFinalAmount,
  referralFeeFinalAmount,
  bypassProtocolFee = false,
  bypassChefFee = false,
}: DonationPlanProps): DonationBreakdown => {
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

  const chefFeeInitialBasisPoints = pot?.chef_fee_basis_points ?? 0;
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
