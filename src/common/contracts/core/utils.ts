import { Big } from "big.js";
import { isNullish } from "remeda";

import { basisPointsToPercents, percentsToBasisPoints } from "@/common/lib";
import type { AccountId } from "@/common/types";

import { TOTAL_FEE_BASIS_POINTS } from "./constants";

export const feeBasisPointsToPercents = (basisPoints: number) =>
  basisPointsToPercents(basisPoints, TOTAL_FEE_BASIS_POINTS);

export const feePercentsToBasisPoints = (feePercents: number) =>
  percentsToBasisPoints(feePercents, TOTAL_FEE_BASIS_POINTS);

export type FtTransferFeeInputs = {
  /**
   * Total amount of tokens.
   */
  totalAmount: Big.Big;

  /**
   * ID of the fee recipient account established by the transaction manager contract.
   */
  feeRecipient?: AccountId | null;

  /**
   * Fee fraction established by the transaction manager contract.
   */
  basisPoints?: number | null;

  /**
   * Fee token amount, if it is already known for certain.
   */
  fixedValue?: number | null;

  /**
   * Whether the sender chose to apply the fee.
   */
  isApplied: boolean;

  /**
   * Whether the transaction is executed and finalized.
   */
  isFinal: boolean;
};

export type FtTransferFee = {
  recipientAccountId?: AccountId | null;
  basisPoints: number;
  percentage: number;
  amount: number;
};

/**
 * Calculates the fungible token transfer fee amount based on the transaction parameters.
 * Currently does not take gas and storage fees into account.
 *
 * Uses Big.js for precision.
 */
export const deriveFtTransferFee = ({
  totalAmount,
  feeRecipient,
  basisPoints: contractBasisPoints = 0,
  fixedValue = null,
  isApplied,
  isFinal,
}: FtTransferFeeInputs): FtTransferFee => {
  const onePercentValue = totalAmount.div(100);

  const initialBasisPoints = (isNullish(feeRecipient) ? null : contractBasisPoints) ?? 0;
  const initialPercentage = feeBasisPointsToPercents(initialBasisPoints);
  const senderBasicPoints = isApplied ? initialBasisPoints : 0;

  const fixedPercentage =
    fixedValue === null ? null : Big(fixedValue).div(onePercentValue).toNumber();

  const fixedBasicPoints =
    fixedPercentage === null ? null : feePercentsToBasisPoints(fixedPercentage);

  const optimisticBasisPoints = fixedBasicPoints ?? senderBasicPoints;
  const optimisticPercentage = fixedPercentage ?? initialPercentage;

  if (isFinal) {
    return {
      recipientAccountId: feeRecipient,
      basisPoints: fixedBasicPoints ?? 0,
      percentage: fixedPercentage ?? 0,
      amount: fixedValue ?? 0,
    };
  } else {
    return {
      recipientAccountId: feeRecipient,
      basisPoints: optimisticBasisPoints,
      percentage: optimisticPercentage,
      amount: totalAmount.times(optimisticBasisPoints).div(TOTAL_FEE_BASIS_POINTS).toNumber(),
    };
  }
};
