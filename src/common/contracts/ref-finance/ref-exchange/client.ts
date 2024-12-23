import { MemoryCache } from "@wpdas/naxios";

import { REF_EXCHANGE_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { naxiosInstance } from "@/common/api/near/client";
import type { AccountId } from "@/common/types";

const contractApi = naxiosInstance.contractApi({
  contractId: REF_EXCHANGE_CONTRACT_ACCOUNT_ID,
  cache: new MemoryCache({ expirationTime: 600 }),
});

export const get_whitelisted_tokens = () =>
  contractApi.view<{}, AccountId[]>("get_whitelisted_tokens");
