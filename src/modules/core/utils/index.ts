import { NearBalanceResponse } from "@/common/api/pagoda";
import { bigNumToFloat } from "@/common/lib";

export const balanceToFloat = (
  amount: NearBalanceResponse["balance"]["amount"],
  decimals: NearBalanceResponse["balance"]["metadata"]["decimals"],
) => bigNumToFloat(amount, decimals);

export const balanceToString = ({
  amount,
  metadata,
}: NearBalanceResponse["balance"]) =>
  `${balanceToFloat(amount, metadata.decimals)} ${metadata.symbol}`;
