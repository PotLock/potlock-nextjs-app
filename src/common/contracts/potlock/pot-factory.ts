import { MemoryCache } from "@wpdas/naxios";
import Big from "big.js";

import { naxiosInstance } from "@/common/api/near";
import { FULL_TGAS, POT_FACTORY_CONTRACT_ID } from "@/common/constants";
import { ByAccountId } from "@/common/types";

import {
  PotDeploymentArgs,
  PotDeploymentResult,
} from "./interfaces/pot-factory.interfaces";

export type { PotDeploymentResult };

/**
 * Contract API
 */
export const contractApi = naxiosInstance.contractApi({
  contractId: POT_FACTORY_CONTRACT_ID,
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
}: PotDeploymentArgs): Promise<undefined | string> =>
  contractApi
    .view<
      { args: typeof pot_args },
      string
    >("calculate_min_deployment_deposit", { args: { args: pot_args } })
    .then((amount) =>
      Big(amount).plus(Big("20000000000000000000000")).toFixed(),
    );

export const deploy_pot = async (
  args: PotDeploymentArgs,
): Promise<PotDeploymentResult> =>
  contractApi.call<typeof args, PotDeploymentResult>("deploy_pot", {
    args,
    deposit: await calculate_min_deployment_deposit(args),
    gas: FULL_TGAS,
    callbackUrl: window.location.href,
  });

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
