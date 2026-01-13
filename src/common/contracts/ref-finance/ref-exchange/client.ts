import { REF_EXCHANGE_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { contractApi } from "@/common/blockchains/near-protocol/client";
import type { AccountId } from "@/common/types";

const refExchangeContractApi = contractApi({
  contractId: REF_EXCHANGE_CONTRACT_ACCOUNT_ID,
});

export const get_whitelisted_tokens = () =>
  refExchangeContractApi.view<{}, AccountId[]>("get_whitelisted_tokens");
