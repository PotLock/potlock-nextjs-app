import { MemoryCache } from "@wpdas/naxios";

import { REF_EXCHANGE_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { naxiosInstance } from "@/common/api/near";

import { WhitelistedTokens } from "./interface";

const contractApi = naxiosInstance.contractApi({
  contractId: REF_EXCHANGE_CONTRACT_ACCOUNT_ID,
  cache: new MemoryCache({ expirationTime: 600 }),
});

export const get_whitelisted_tokens = () =>
  contractApi.view<{}, WhitelistedTokens>("get_whitelisted_tokens");
