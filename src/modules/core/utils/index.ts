import Big from "big.js";

import { NearBalanceResponse } from "@/common/api/pagoda";
import { bigNumToFloat } from "@/common/lib";
import formatWithCommas from "@/common/lib/formatWithCommas";
import { fetchNearPrice } from "@/common/services";

export const yoctosToUsdWithFallback = async (
  amountYoctos: string,
  abbreviate?: boolean,
): Promise<string> => {
  const nearToUsd = await fetchNearPrice();

  if (nearToUsd === undefined) return "Error loading price";

  return nearToUsd
    ? "~$" +
        formatWithCommas(Big(amountYoctos).mul(nearToUsd).div(1e24).toFixed(2))
    : formatWithCommas(Big(amountYoctos).div(1e24).toFixed(2)) +
        (abbreviate ? "N" : " NEAR");
};

export const balanceToFloat = (
  amount: NearBalanceResponse["balance"]["amount"],
  decimals: NearBalanceResponse["balance"]["metadata"]["decimals"],
) => bigNumToFloat(amount, decimals);

export const balanceToString = ({
  amount,
  metadata,
}: NearBalanceResponse["balance"]) =>
  `${balanceToFloat(amount, metadata.decimals)} ${metadata.symbol}`;
