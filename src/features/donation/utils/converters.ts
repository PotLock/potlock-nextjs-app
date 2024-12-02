import { TOTAL_FEE_BASIS_POINTS } from "@/modules/core/constants";

export const donationFeeBasisPointsToPercents = (basisPoints: number) =>
  basisPoints / (TOTAL_FEE_BASIS_POINTS / 100);

export const donationFeePercentsToBasisPoints = (percent: number) =>
  percent * (TOTAL_FEE_BASIS_POINTS / 100);
