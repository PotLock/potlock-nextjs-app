import { REQUEST_CONFIG } from "@/common/constants";

import { swrHooks } from "./generated";
import { ByAccountId, ByPotId } from "./types";

export const useAccount = ({ accountId }: ByAccountId) =>
  swrHooks.useV1AccountsRetrieve2(accountId, REQUEST_CONFIG);

export const useAccounts = () => swrHooks.useV1AccountsRetrieve(REQUEST_CONFIG);

export const usePot = ({ potId }: ByPotId) =>
  swrHooks.useV1PotsRetrieve2(potId, REQUEST_CONFIG);

export const usePots = () => swrHooks.useV1PotsRetrieve(REQUEST_CONFIG);
