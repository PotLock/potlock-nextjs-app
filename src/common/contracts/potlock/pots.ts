import { MemoryCache } from "@wpdas/naxios";

import { POTLOCK_POT_FACTORY_CONTRACT_ID } from "@/common/constants";

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
export const getConfig = () => contractApi.view<{}, Config>("get_config");

export const canUserDeployPot = async ({
  accountId,
}: {
  accountId: string;
}) => {
  const config = await getConfig();
  if (config) {
    return (
      !config.require_whitelist ||
      config.whitelisted_deployers.includes(accountId)
    );
  }

  return false;
};
