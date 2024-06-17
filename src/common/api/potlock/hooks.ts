import { REQUEST_CONFIG } from "@/common/constants";

import { swrHooks } from "./generated";
import { ByAccountId, ByPotId } from "./types";

export const useAccounts = () => swrHooks.useV1AccountsRetrieve(REQUEST_CONFIG);

export const useAccount = ({ accountId }: ByAccountId) =>
  swrHooks.useV1AccountsRetrieve2(accountId, REQUEST_CONFIG);

export const useAccountActivePots = ({ accountId }: ByAccountId) =>
  swrHooks.useV1AccountsActivePotsRetrieve(
    accountId,
    { status: "live" },
    REQUEST_CONFIG,
  );

export const usePots = () => swrHooks.useV1PotsRetrieve(REQUEST_CONFIG);

export const useAccountDonationsReceived = ({ accountId }: ByAccountId) =>
  swrHooks.useV1AccountsDonationsReceivedRetrieve(accountId, REQUEST_CONFIG);

export const usePot = ({ potId }: ByPotId) =>
  swrHooks.useV1PotsRetrieve2(potId, REQUEST_CONFIG);
