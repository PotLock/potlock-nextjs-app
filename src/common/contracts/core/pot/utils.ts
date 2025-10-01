import { calculateDepositByDataSize } from "@wpdas/naxios";
import { Big } from "big.js";

import { ONE_HUNDREDTH_NEAR } from "@/common/constants";
import { parseNearAmount } from "@/common/lib";
import type { IndivisibleUnits } from "@/common/types";

import type { ApplyArgs } from "./client";

type CallDepositParams =
  | { functionName: "apply"; args: ApplyArgs }
  | { functionName: string; args: {} };

export const calculateCallDeposit = ({
  functionName,
  args,
}: CallDepositParams): IndivisibleUnits => {
  switch (functionName) {
    case "apply": {
      return (
        parseNearAmount(Big(0.01).times(calculateDepositByDataSize(args)).toString()) ??
        ONE_HUNDREDTH_NEAR
      );
    }

    default: {
      return "0";
    }
  }
};
