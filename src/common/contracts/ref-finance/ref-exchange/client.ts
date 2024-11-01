import { MemoryCache } from "@wpdas/naxios";

import { naxiosInstance } from "@/common/api/near";
import { REF_EXCHANGE_CONTRACT_ACCOUNT_ID } from "@/common/config";
import { AccountId } from "@/common/types";

const contractApi = naxiosInstance.contractApi({
  contractId: REF_EXCHANGE_CONTRACT_ACCOUNT_ID,
  cache: new MemoryCache({ expirationTime: 600 }),
});

export const get_whitelisted_tokens = () =>
  contractApi.view<{}, AccountId[]>("get_whitelisted_tokens");
