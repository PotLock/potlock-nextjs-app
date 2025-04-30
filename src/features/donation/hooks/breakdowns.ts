import { Big } from "big.js";

import { Pot, indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { TOTAL_FEE_BASIS_POINTS } from "@/common/contracts/core/constants";
import { feeBasisPointsToPercents } from "@/common/contracts/core/utils";
import { type ByTokenId } from "@/common/types";
import { useWalletUserSession } from "@/common/wallet";

import { DonationSubmitParams } from "../models/schemas";
import { DonationBreakdown, WithTotalAmount } from "../types";

export type DonationAllocationParams = WithTotalAmount &
  ByTokenId &
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
  tokenId,
}: DonationAllocationParams): DonationBreakdown => {
  const viewer = useWalletUserSession();
  const { data: donationConfig } = indexer.useDonationConfig();
  const totalAmountBig = Big(totalAmountFloat);

  // TODO: (non-critical)
  //* Recalculate basis points if `protocolFeeFinalAmount` and `referralFeeFinalAmount` are provided

  /**
   *? Protocol fee:
   */

  const protocolFeeInitialBasisPoints = donationConfig?.protocol_fee_basis_points ?? 0;

  const protocolFeeBasisPoints = bypassProtocolFee ? 0 : protocolFeeInitialBasisPoints;

  const protocolFeeAmount =
    protocolFeeFinalAmount ??
    totalAmountBig.times(protocolFeeBasisPoints).div(TOTAL_FEE_BASIS_POINTS).toNumber();

  const protocolFeePercent = feeBasisPointsToPercents(protocolFeeInitialBasisPoints);

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

  const referralFeePercent = feeBasisPointsToPercents(referralFeeBasisPoints);

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

  const chefFeePercent = feeBasisPointsToPercents(chefFeeInitialBasisPoints);

  /**
   *? Project allocation:
   */

  const projectAllocationBasisPoints =
    TOTAL_FEE_BASIS_POINTS - protocolFeeBasisPoints - chefFeeBasisPoints - referralFeeBasisPoints;

  const projectAllocationAmount = totalAmountBig
    .times(projectAllocationBasisPoints)
    .div(TOTAL_FEE_BASIS_POINTS)
    .toNumber();

  const projectAllocationPercent = feeBasisPointsToPercents(projectAllocationBasisPoints);

  const storageFeeApproximation = tokenId === NATIVE_TOKEN_ID ? "< 0.00001" : "≤ 0.03";

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
    storageFeeApproximation,
  };
};
