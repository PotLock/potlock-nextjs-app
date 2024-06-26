import { potlock } from "@/common/api/potlock";
import { TOTAL_FEE_BASIS_POINTS } from "@/modules/core/constants";

import { DonationInputs } from "../models";

export type DonationFeeInputs = Pick<
  DonationInputs,
  "amount" | "referrerAccountId" | "potAccountId"
> &
  Partial<Pick<DonationInputs, "bypassProtocolFee" | "bypassChefFee">> & {};

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

export const basisPointsToPercent = (basisPoints: number) => basisPoints / 100;

export const useDonationFees = ({
  amount,
  referrerAccountId,
  potAccountId,
  bypassProtocolFee = false,
  bypassChefFee = false,
}: DonationFeeInputs): DonationFees => {
  const { data: potlockDonationConfig } = potlock.useDonationConfig();
  const { data: potData } = potlock.usePot({ potId: potAccountId });

  /**
   *? Protocol fee:
   */

  const protocolFeeInitialBasisPoints =
    potlockDonationConfig?.protocol_fee_basis_points ?? 0;

  const protocolFeeBasisPoints = bypassProtocolFee
    ? 0
    : protocolFeeInitialBasisPoints;

  const protocolFeeAmount =
    (amount * protocolFeeBasisPoints) / TOTAL_FEE_BASIS_POINTS;

  const protocolFeePercent = basisPointsToPercent(
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
    potData?.referral_fee_public_round_basis_points ??
    potlockReferralFeeBasisPoints;

  const referralFeeBasisPoints = referrerAccountId
    ? referralFeeInitialBasisPoints
    : 0;

  const referralFeeAmount =
    (amount * referralFeeBasisPoints) / TOTAL_FEE_BASIS_POINTS;

  const referralFeePercent = basisPointsToPercent(referralFeeBasisPoints);

  /**
   *? Chef fee:
   */

  const chefFeeInitialBasisPoints = potData?.chef_fee_basis_points ?? 0;
  const chefFeeBasisPoints = bypassChefFee ? 0 : chefFeeInitialBasisPoints;
  const chefFeeAmount = (amount * chefFeeBasisPoints) / TOTAL_FEE_BASIS_POINTS;
  const chefFeePercent = basisPointsToPercent(chefFeeInitialBasisPoints);

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

  const projectAllocationPercent = basisPointsToPercent(
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
