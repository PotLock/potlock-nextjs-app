import { potlock } from "@/common/api/potlock";
import { Config } from "@/common/contracts/potlock/interfaces/donate.interfaces";
import { TOTAL_FEE_BASIS_POINTS } from "@/modules/core/constants";

import { DonationInputs } from "../models";

export type DonationFeeInputs = DonationInputs & {};

export type DonationFees = {
  projectAllocationAmount: number;
  projectAllocationPercent: number;
  protocolFeeAmount: number;
  protocolFeePercent: number;
  protocolFeeRecipientAccountId?: string;
  referrerFeeAmount: number;
  referrerFeePercent: number;
  chefFeeAmount: number;
  chefFeePercent: number;
};

export const basisPointsToPercent = (basisPoints: number) => basisPoints / 100;

export const useDonationFees = ({
  amount,
  potAccountId,
  bypassProtocolFee,
  bypassChefFee,
}: DonationFeeInputs): DonationFees => {
  const { data: potlockDonationConfig }: { data?: Config } = {};

  // !TODO: determine the source
  const referrerId = undefined;

  const protocolFeeBasisPoints =
    potlockDonationConfig?.protocol_fee_basis_points ?? 0;

  const potlockReferralFeeBasisPoints =
    potlockDonationConfig?.referral_fee_basis_points ?? 0;

  const { data: potData } = potlock.usePot({ potId: potAccountId ?? "" });

  const referralFeeBasisPoints =
    potData?.referral_fee_public_round_basis_points ??
    potlockReferralFeeBasisPoints;

  const chefFeeBasisPoints = potData?.chef_fee_basis_points ?? 0;

  const projectAllocationBasisPoints =
    TOTAL_FEE_BASIS_POINTS -
    (bypassProtocolFee ? 0 : protocolFeeBasisPoints) -
    (bypassChefFee ? 0 : chefFeeBasisPoints) -
    (referrerId ? 0 : referralFeeBasisPoints);

  return {
    projectAllocationAmount:
      (amount * projectAllocationBasisPoints) / TOTAL_FEE_BASIS_POINTS,

    projectAllocationPercent: basisPointsToPercent(
      projectAllocationBasisPoints,
    ),

    protocolFeeAmount:
      (amount * protocolFeeBasisPoints) / TOTAL_FEE_BASIS_POINTS,

    protocolFeePercent: basisPointsToPercent(protocolFeeBasisPoints),

    protocolFeeRecipientAccountId:
      potlockDonationConfig?.protocol_fee_recipient_account,

    referrerFeeAmount:
      (amount * referralFeeBasisPoints) / TOTAL_FEE_BASIS_POINTS,

    referrerFeePercent: basisPointsToPercent(referralFeeBasisPoints),

    chefFeeAmount: (amount * chefFeeBasisPoints) / TOTAL_FEE_BASIS_POINTS,

    chefFeePercent: basisPointsToPercent(chefFeeBasisPoints),
  };
};
