import { MemoryCache } from "@wpdas/naxios";
import Big from "big.js";

import { naxiosInstance } from "@/common/api/near";
import { POTLOCK_POT_FACTORY_CONTRACT_ID } from "@/common/constants";
import { ByAccountId } from "@/common/types";

import { Pot, PotDeploymentArgs } from "./interfaces/pot-factory.interfaces";

/**
 * Contract API
 */
export const contractApi = naxiosInstance.contractApi({
  contractId: POTLOCK_POT_FACTORY_CONTRACT_ID,
  cache: new MemoryCache({ expirationTime: 5 }), // 10 seg
});

// READ METHODS

type Config = {
  require_whitelist: boolean;
  whitelisted_deployers: string[];
};

export const get_config = () => contractApi.view<{}, Config>("get_config");

export const calculate_min_deployment_deposit = ({
  pot_args,
}: PotDeploymentArgs): Promise<string> =>
  contractApi
    .view<
      { args: typeof pot_args },
      string
    >("calculate_min_deployment_deposit", { args: { args: pot_args } })
    .then((amount) =>
      Big(amount)
        .plus(
          // add extra 0.02 NEAR as buffer
          Big("20000000000000000000000"),
        )
        .toString(),
    );

export const deploy_pot = async (args: PotDeploymentArgs): Promise<Pot> => {
  return contractApi.call<typeof args, Pot>("deploy_pot", {
    args,
    deposit: await calculate_min_deployment_deposit(args),
    callbackUrl: window.location.href,
  });
};

export const isDeploymentAvailable = async ({ accountId }: ByAccountId) => {
  const config = await get_config();
  if (config) {
    return (
      !config.require_whitelist ||
      config.whitelisted_deployers.includes(accountId)
    );
  }

  return false;
};