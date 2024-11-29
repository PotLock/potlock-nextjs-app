import { MemoryCache } from "@wpdas/naxios";

import { METAPOOL_LOCKUP_STAKE_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { naxiosInstance } from "@/common/api/near";

export const contractApi = naxiosInstance.contractApi({
  contractId: METAPOOL_LOCKUP_STAKE_CONTRACT_ACCOUNT_ID,
  cache: new MemoryCache({ expirationTime: 600 }),
});
