import { potlock } from "@/common/api/potlock";
import { Config } from "@/common/contracts/potlock/interfaces/donate.interfaces";
import { TOTAL_FEE_BASIS_POINTS } from "@/modules/core/constants";

import { DonationInputs } from "../models";

export type DonationFeeInputs = DonationInputs & {};

export type DonationFees = {
  projectAllocationPercent: number;
  projectAllocationAmount: number;
  protocolFeePercent: number;
  protocolFeeAmount: number;
  protocolFeeRecipientAccountId?: string;
  referrerFeePercent: number;
  referrerFeeAmount: number;
  chefFeePercent: number;
  chefFeeAmount: number;
};

export const basisPointsToPercent = (basisPoints: number) => basisPoints / 100;

export const useDonationFees = ({
  amount,
  potAccountId,
  bypassProtocolFee,
  bypassChefFee,
}: DonationFeeInputs): DonationFees => {
  const { data: potlockDonationConfig }: { data?: Config } = {};

  const protocolFeeBasisPoints =
    potlockDonationConfig?.protocol_fee_basis_points ?? 0;

  const potlockReferralFeeBasisPoints =
    potlockDonationConfig?.referral_fee_basis_points ?? 0;

  const { data: potData } = potlock.usePot({ potId: potAccountId ?? "" });

  const referralFeeBasisPoints =
    potData?.referral_fee_public_round_basis_points ??
    potlockReferralFeeBasisPoints;

  const chefFeeBasisPoints = potData?.chef_fee_basis_points ?? 0.0;

  const projectAllocationBasisPoints =
    TOTAL_FEE_BASIS_POINTS -
    (bypassProtocolFee ? 0 : protocolFeeBasisPoints) -
    (bypassChefFee ? 0 : chefFeeBasisPoints) -
    (referrerId ? 0 : referralFeeBasisPoints);

  return {
    projectAllocationPercent: basisPointsToPercent(
      projectAllocationBasisPoints,
    ),

    projectAllocationAmount:
      (amount * projectAllocationBasisPoints) / TOTAL_FEE_BASIS_POINTS,

    protocolFeePercent: basisPointsToPercent(protocolFeeBasisPoints),

    protocolFeeAmount:
      (amount * protocolFeeBasisPoints) / TOTAL_FEE_BASIS_POINTS,

    protocolFeeRecipientAccountId:
      potlockDonationConfig?.protocol_fee_recipient_account,

    referrerFeePercent: basisPointsToPercent(referralFeeBasisPoints),

    referrerFeeAmount:
      (amount * referralFeeBasisPoints) / TOTAL_FEE_BASIS_POINTS,

    chefFeePercent: basisPointsToPercent(chefFeeBasisPoints),

    chefFeeAmount: (amount * chefFeeBasisPoints) / TOTAL_FEE_BASIS_POINTS,
  };
};
