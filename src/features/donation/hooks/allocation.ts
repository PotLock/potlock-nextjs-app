import { useMemo } from "react";

import { Big } from "big.js";

import { Pot } from "@/common/api/indexer";
import type { Campaign } from "@/common/contracts/core/campaigns";
import { TOTAL_FEE_BASIS_POINTS } from "@/common/contracts/core/constants";
import { donationContractHooks } from "@/common/contracts/core/donation";
import {
  type FtTransferFee,
  deriveFtTransferFee,
  feeBasisPointsToPercents,
} from "@/common/contracts/core/utils";

import { DonationSubmitParams } from "../models/schemas";
import { WithTotalAmount } from "../types";

export type DonationAllocationParams = WithTotalAmount &
  Partial<
    Pick<
      DonationSubmitParams,
      "bypassProtocolFee" | "bypassReferralFee" | "bypassCuratorFee" | "referrerAccountId"
    >
  > & {
    campaign?: Campaign;
    potCache?: Pot;
    isFinal?: boolean;
    protocolFeeReceiptAmount?: number | null;
    referralFeeReceiptAmount?: number | null;
    curatorFeeReceiptAmount?: number | null;
  };

export type DonationAllocationBreakdown = {
  protocolFee: FtTransferFee;
  referralFee: FtTransferFee;
  curatorFee: FtTransferFee;
  curatorTitle: string;
  netPercent: number;
  netAmount: number;
};

export const useDonationAllocationBreakdown = ({
  campaign,
  potCache,
  totalAmountFloat,
  referrerAccountId,
  bypassProtocolFee = false,
  bypassReferralFee = false,
  bypassCuratorFee = false,
  isFinal = false,
  protocolFeeReceiptAmount = null,
  referralFeeReceiptAmount = null,
  curatorFeeReceiptAmount = null,
}: DonationAllocationParams): DonationAllocationBreakdown => {
  const { data: donationConfig } = donationContractHooks.useConfig();
  const totalAmountBig = useMemo(() => Big(totalAmountFloat), [totalAmountFloat]);

  /**
   * Fee received by the donation protocol maintainers.
   */
  const protocolFee = useMemo(
    () =>
      deriveFtTransferFee({
        totalAmount: totalAmountBig,
        feeRecipient: donationConfig?.protocol_fee_recipient_account,
        basisPoints: donationConfig?.protocol_fee_basis_points,
        fixedValue: protocolFeeReceiptAmount,
        isApplied: !bypassProtocolFee,
        isFinal,
      }),
    [
      bypassProtocolFee,
      donationConfig?.protocol_fee_basis_points,
      donationConfig?.protocol_fee_recipient_account,
      isFinal,
      protocolFeeReceiptAmount,
      totalAmountBig,
    ],
  );

  /**
   * Fee received by the donor's referrer.
   */
  const referralFee = useMemo(
    () =>
      deriveFtTransferFee({
        totalAmount: totalAmountBig,
        feeRecipient: referrerAccountId,

        basisPoints:
          campaign?.referral_fee_basis_points ??
          potCache?.referral_fee_public_round_basis_points ??
          donationConfig?.referral_fee_basis_points,

        fixedValue: referralFeeReceiptAmount,
        isApplied: !bypassReferralFee,
        isFinal,
      }),
    [
      bypassReferralFee,
      campaign?.referral_fee_basis_points,
      donationConfig?.referral_fee_basis_points,
      isFinal,
      potCache?.referral_fee_public_round_basis_points,
      referralFeeReceiptAmount,
      referrerAccountId,
      totalAmountBig,
    ],
  );

  /**
   * Fee received by either campaign creator or pot chef.
   */
  const curatorFee = useMemo(
    () =>
      deriveFtTransferFee({
        totalAmount: totalAmountBig,
        feeRecipient: campaign?.owner ?? potCache?.chef?.id,
        basisPoints: campaign?.creator_fee_basis_points ?? potCache?.chef_fee_basis_points,
        fixedValue: curatorFeeReceiptAmount,
        isApplied: !bypassCuratorFee,
        isFinal,
      }),
    [
      bypassCuratorFee,
      campaign?.creator_fee_basis_points,
      campaign?.owner,
      curatorFeeReceiptAmount,
      isFinal,
      potCache?.chef?.id,
      potCache?.chef_fee_basis_points,
      totalAmountBig,
    ],
  );

  const curatorTitle = useMemo(() => {
    if (campaign?.id !== undefined) {
      return "Creator";
    } else if (potCache?.account !== undefined) {
      return "Chef";
    } else return "Curator";
  }, [campaign?.id, potCache?.account]);

  const netBasisPoints = useMemo(
    () =>
      Big(TOTAL_FEE_BASIS_POINTS)
        .minus(protocolFee.basisPoints)
        .minus(referralFee.basisPoints)
        .minus(curatorFee.basisPoints)
        .toNumber(),

    [curatorFee.basisPoints, protocolFee.basisPoints, referralFee.basisPoints],
  );

  const netAmount = useMemo(
    () => totalAmountBig.times(netBasisPoints).div(TOTAL_FEE_BASIS_POINTS).toNumber(),
    [netBasisPoints, totalAmountBig],
  );

  const netPercent = useMemo(() => feeBasisPointsToPercents(netBasisPoints), [netBasisPoints]);

  return { protocolFee, referralFee, curatorFee, curatorTitle, netAmount, netPercent };
};
