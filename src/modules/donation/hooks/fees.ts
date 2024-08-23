import { Pot, potlock } from "@/common/api/potlock";
import { TOTAL_FEE_BASIS_POINTS } from "@/modules/core/constants";

import { DonationInputs } from "../models";
import { donationFeeBasisPointsToPercents } from "../utils/converters";

export type DonationFeeInputs = Pick<
  DonationInputs,
  "amount" | "referrerAccountId"
> &
  Partial<Pick<DonationInputs, "bypassProtocolFee" | "bypassChefFee">> & {
    pot?: Pot;
    protocolFeeFinalAmount?: number;
    referralFeeFinalAmount?: number;
  };

export type DonationFees = {
  projectAllocationAmount: number;
  projectAllocationPercent: number;
  protocolFeeAmount: number;
  protocolFeePercent: number;
  protocolFeeRecipientAccountId?: string;
  referralFeeAmount: number;
  referralFeePercent: number;
  chefFeeAmount: number;
  chefFeePercent: number;
};

export const useDonationFees = ({
  pot,
  amount,
  referrerAccountId,
  protocolFeeFinalAmount,
  referralFeeFinalAmount,
  bypassProtocolFee = false,
  bypassChefFee = false,
}: DonationFeeInputs): DonationFees => {
  const { data: potlockDonationConfig } = potlock.useDonationConfig();

  // TODO: Recalculate basic points if `protocolFeeFinalAmount` and `referralFeeFinalAmount` are provided

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
    (amount * protocolFeeBasisPoints) / TOTAL_FEE_BASIS_POINTS;

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
    (amount * referralFeeBasisPoints) / TOTAL_FEE_BASIS_POINTS;

  const referralFeePercent = donationFeeBasisPointsToPercents(
    referralFeeBasisPoints,
  );

  /**
   *? Chef fee:
   */

  const chefFeeInitialBasisPoints = pot?.chef_fee_basis_points ?? 0;
  const chefFeeBasisPoints = bypassChefFee ? 0 : chefFeeInitialBasisPoints;
  const chefFeeAmount = (amount * chefFeeBasisPoints) / TOTAL_FEE_BASIS_POINTS;

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
    (amount * projectAllocationBasisPoints) / TOTAL_FEE_BASIS_POINTS;

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
