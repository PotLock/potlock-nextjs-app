import { Big } from "big.js";

import { Pot } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import type { Campaign } from "@/common/contracts/core/campaigns";
import { TOTAL_FEE_BASIS_POINTS } from "@/common/contracts/core/constants";
import { donationContractHooks } from "@/common/contracts/core/donation";
import { feeBasisPointsToPercents, feePercentsToBasisPoints } from "@/common/contracts/core/utils";
import { type ByTokenId } from "@/common/types";

import { DonationSubmitParams } from "../models/schemas";
import { DonationBreakdown, WithTotalAmount } from "../types";

export type DonationAllocationParams = WithTotalAmount &
  ByTokenId &
  Partial<
    Pick<
      DonationSubmitParams,
      "bypassProtocolFee" | "bypassReferralFee" | "bypassCuratorFee" | "referrerAccountId"
    >
  > & {
    campaign?: Campaign;
    potCache?: Pot;
    protocolFeeFinalAmount?: number;
    referralFeeFinalAmount?: number;
  };

export const useDonationAllocationBreakdown = ({
  referrerAccountId,
  totalAmountFloat,
  campaign,
  potCache,
  protocolFeeFinalAmount,
  referralFeeFinalAmount,
  bypassReferralFee = false,
  bypassProtocolFee = false,
  bypassCuratorFee = false,
  tokenId,
}: DonationAllocationParams): DonationBreakdown => {
  const { data: donationConfig } = donationContractHooks.useConfig();
  const totalAmountBig = Big(totalAmountFloat);

  /**
   ** Protocol fee:
   */

  const protocolFeeInitialBasisPoints = donationConfig?.protocol_fee_basis_points ?? 0;

  const protocolFeeFinalPercent =
    protocolFeeFinalAmount === undefined
      ? null
      : Big(protocolFeeFinalAmount).div(totalAmountBig.div(100)).toNumber();

  const protocolFeeBasisPoints = bypassProtocolFee ? 0 : protocolFeeInitialBasisPoints;

  const protocolFeeFinalBasisPoints =
    protocolFeeFinalPercent === null ? null : feePercentsToBasisPoints(protocolFeeFinalPercent);

  const protocolFeeAmount = totalAmountBig
    .times(protocolFeeFinalBasisPoints ?? protocolFeeBasisPoints)
    .div(TOTAL_FEE_BASIS_POINTS)
    .toNumber();

  const protocolFeePercent = feeBasisPointsToPercents(
    protocolFeeFinalBasisPoints ?? protocolFeeInitialBasisPoints,
  );

  const protocolFeeRecipientAccountId = donationConfig?.protocol_fee_recipient_account;

  /**
   ** Referral fee:
   */

  const referralFeeInitialBasisPoints =
    referrerAccountId === undefined
      ? 0
      : (campaign?.referral_fee_basis_points ??
        potCache?.referral_fee_public_round_basis_points ??
        donationConfig?.referral_fee_basis_points ??
        0);

  const referralFeeFinalPercent =
    referralFeeFinalAmount === undefined
      ? null
      : Big(referralFeeFinalAmount).div(totalAmountBig.div(100)).toNumber();

  const referralFeeBasisPoints = bypassReferralFee ? 0 : referralFeeInitialBasisPoints;

  const referralFeeFinalBasisPoints =
    referralFeeFinalPercent === null ? null : feePercentsToBasisPoints(referralFeeFinalPercent);

  const referralFeeAmount = totalAmountBig
    .times(referralFeeFinalBasisPoints ?? referralFeeBasisPoints)
    .div(TOTAL_FEE_BASIS_POINTS)
    .toNumber();

  const referralFeePercent = feeBasisPointsToPercents(
    referralFeeFinalBasisPoints ?? referralFeeInitialBasisPoints,
  );

  /**
   ** Chef fee:
   */

  const chefFeeInitialBasisPoints =
    typeof potCache?.chef?.id === "string" ? (potCache?.chef_fee_basis_points ?? 0) : 0;

  const chefFeeBasisPoints = bypassCuratorFee ? 0 : chefFeeInitialBasisPoints;

  const chefFeeAmount = totalAmountBig
    .times(chefFeeBasisPoints)
    .div(TOTAL_FEE_BASIS_POINTS)
    .toNumber();

  const chefFeePercent = feeBasisPointsToPercents(chefFeeInitialBasisPoints);

  /**
   ** Campaign creator fee:
   */

  const campaignCreatorFeeInitialBasisPoints = campaign?.creator_fee_basis_points ?? 0;

  const campaignCreatorFeeBasisPoints = bypassCuratorFee ? 0 : campaignCreatorFeeInitialBasisPoints;

  const campaignCreatorFeeAmount = totalAmountBig
    .times(campaignCreatorFeeBasisPoints)
    .div(TOTAL_FEE_BASIS_POINTS)
    .toNumber();

  const campaignCreatorFeePercent = feeBasisPointsToPercents(campaignCreatorFeeInitialBasisPoints);

  /**
   ** Project allocation:
   */

  const projectAllocationBasisPoints = Big(TOTAL_FEE_BASIS_POINTS)
    .minus(protocolFeeBasisPoints)
    .minus(referralFeeBasisPoints)
    .minus(chefFeeBasisPoints)
    .minus(campaignCreatorFeeBasisPoints)
    .toNumber();

  const projectAllocationAmount = totalAmountBig
    .times(projectAllocationBasisPoints)
    .div(TOTAL_FEE_BASIS_POINTS)
    .toNumber();

  const projectAllocationPercent = feeBasisPointsToPercents(projectAllocationBasisPoints);

  const storageFeeApproximation = tokenId === NATIVE_TOKEN_ID ? "< 0.0015" : "≤ 0.03";

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
    campaignCreatorFeeAmount,
    campaignCreatorFeePercent,
    storageFeeApproximation,
  };
};
