import { METAPOOL_LIQUID_STAKING_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { contractApi } from "@/common/blockchains/near-protocol/client";
import { IndivisibleUnits } from "@/common/types";

export const liquidStakingContractApi = contractApi({
  contractId: METAPOOL_LIQUID_STAKING_CONTRACT_ACCOUNT_ID,
});

export const get_stnear_price = () =>
  liquidStakingContractApi.view<{}, IndivisibleUnits>("get_stnear_price");
