import { MemoryCache } from "@wpdas/naxios";
import { Big } from "big.js";

import { POT_FACTORY_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { naxiosInstance } from "@/common/api/near-protocol/client";
import { FULL_TGAS } from "@/common/constants";

import { PotArgs, PotDeploymentResult, PotFactoryConfig } from "./interfaces";

const contractApi = naxiosInstance.contractApi({
  contractId: POT_FACTORY_CONTRACT_ACCOUNT_ID,
  cache: new MemoryCache({ expirationTime: 5 }), // 10 seg
});

export const get_config = () => contractApi.view<{}, PotFactoryConfig>("get_config");

export const calculate_min_deployment_deposit = (args: {
  args: PotArgs;
}): Promise<undefined | string> =>
  contractApi
    .view<typeof args, string>("calculate_min_deployment_deposit", { args })
    .then((amount) => Big(amount).plus(Big("20000000000000000000000")).toFixed())
    .catch((error) => {
      console.error(error);
      return undefined;
    });

export const deploy_pot = async (args: {
  pot_args: PotArgs;
  pot_handle?: null | string;
}): Promise<PotDeploymentResult> =>
  contractApi.call<typeof args, PotDeploymentResult>("deploy_pot", {
    args,
    deposit: await calculate_min_deployment_deposit({ args: args.pot_args }),
    gas: FULL_TGAS,
    callbackUrl: window.location.href,
  });
