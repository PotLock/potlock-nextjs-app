import { Pot } from "@/common/api/potlock";
import useWallet from "@/modules/auth/hooks/useWallet";
import { getDateTime, yoctosToUsdWithFallback } from "@/modules/core";

export const usePotStatusesForAccountId = (props: { potDetail: Pot }) => {
  const now = Date.now();
  const { potDetail } = props;
  const { wallet } = useWallet();
  const matchingPoolUsdBalance = yoctosToUsdWithFallback(
    potDetail.matching_pool_balance,
  );
  const referrerPotLink = `${window.location.origin}${window.location.pathname}&referrerId=${wallet?.accountId}`;

  const publicRoundOpen =
    now >= getDateTime(potDetail.matching_round_start) &&
    now < getDateTime(potDetail.matching_round_end);
  const canDonate = publicRoundOpen && wallet?.accountId;
  const canFund = now < getDateTime(potDetail.matching_round_end);
  const canApply = true;

  return {
    matchingPoolUsdBalance,
    referrerPotLink,
    publicRoundOpen,
    canDonate,
    canFund,
    canApply,
  };
};
