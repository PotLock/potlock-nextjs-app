import { MemoryCache } from "@wpdas/naxios";

import { POTLOCK_POT_FACTORY_CONTRACT_ID } from "@/common/constants";
import { ByAccountId } from "@/common/types";

import { Pot, PotDeploymentArgs } from "./interfaces/pot-factory.interfaces";
import { naxiosInstance } from "..";

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

export const deploy_pot = (args: PotDeploymentArgs) => {
  console.log("potFactory.deploy_pot", args);

  return contractApi.call<typeof args, Pot>("deploy_pot", {
    args,
    // deposit: depositAmountYocto, // TODO: calculate deposit!
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
