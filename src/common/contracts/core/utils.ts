import { basisPointsToPercents, percentsToBasisPoints } from "@/common/lib";

import { TOTAL_FEE_BASIS_POINTS } from "./constants";

export const feeBasisPointsToPercents = (basisPoints: number) =>
  basisPointsToPercents(basisPoints, TOTAL_FEE_BASIS_POINTS);

export const feePercentsToBasisPoints = (feePercents: number) =>
  percentsToBasisPoints(feePercents, TOTAL_FEE_BASIS_POINTS);
