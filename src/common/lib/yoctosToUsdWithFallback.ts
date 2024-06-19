import Big from "big.js";

import formatWithCommas from "./formatWithCommas";
import { fetchNearPrice } from "../services";

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
