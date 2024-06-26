import { NearBalanceResponse } from "@/common/api/pagoda";
import { bigStringToFloat } from "@/common/lib";

export const balanceToFloat = (
  amount: NearBalanceResponse["balance"]["amount"],
  decimals: NearBalanceResponse["balance"]["metadata"]["decimals"],
) => bigStringToFloat(amount, decimals);

export const balanceToString = ({
  amount,
  metadata,
}: NearBalanceResponse["balance"]) =>
  `${balanceToFloat(amount, metadata.decimals)} ${metadata.symbol}`;
