import { MemoryCache } from "@wpdas/naxios";

import { METAPOOL_LIQUID_STAKING_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { naxiosInstance } from "@/common/blockchains/near-protocol/client";
import { IndivisibleUnits } from "@/common/types";

export const contractApi = naxiosInstance.contractApi({
  contractId: METAPOOL_LIQUID_STAKING_CONTRACT_ACCOUNT_ID,
  cache: new MemoryCache({ expirationTime: 600 }),
});

export const get_stnear_price = () => contractApi.view<{}, IndivisibleUnits>("get_stnear_price");
