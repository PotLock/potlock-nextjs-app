import { POTLOCK_REQUEST_CONFIG } from "@/common/constants";

import { swrHooks } from "./generated";
import { ByAccountId, ByPotId } from "./types";

export const useAccounts = () =>
  swrHooks.useV1AccountsRetrieve(POTLOCK_REQUEST_CONFIG);

export const useAccount = ({ accountId }: ByAccountId) =>
  swrHooks.useV1AccountsRetrieve2(accountId, POTLOCK_REQUEST_CONFIG);

export const useAccountActivePots = ({ accountId }: ByAccountId) =>
  swrHooks.useV1AccountsActivePotsRetrieve(
    accountId,
    { status: "live" },
    POTLOCK_REQUEST_CONFIG,
  );

export const usePots = () => swrHooks.useV1PotsRetrieve(POTLOCK_REQUEST_CONFIG);

export const useAccountDonationsReceived = ({ accountId }: ByAccountId) =>
  swrHooks.useV1AccountsDonationsReceivedRetrieve(
    accountId,
    POTLOCK_REQUEST_CONFIG,
  );

export const usePot = ({ potId }: ByPotId) =>
  swrHooks.useV1PotsRetrieve2(potId, POTLOCK_REQUEST_CONFIG);
