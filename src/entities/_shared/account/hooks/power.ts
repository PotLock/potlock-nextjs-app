import { useMemo } from "react";

import { potFactoryContractHooks } from "@/common/contracts/core/pot-factory";
import { isAccountId } from "@/common/lib";
import type { ByAccountId } from "@/common/types";

import type { AccountPower } from "../types";

export const useAccountPower = ({ accountId }: Partial<ByAccountId>) => {
  const isAccountIdValid = useMemo(
    () => accountId !== undefined && isAccountId(accountId),
    [accountId],
  );

  const {
    isLoading: isPotFactoryConfigLoading,
    data: potFactoryConfig,
    error: potFactoryConfigLoadingError,
  } = potFactoryContractHooks.useConfig({ enabled: isAccountIdValid });

  const power: AccountPower = useMemo(() => {
    if (accountId && isAccountIdValid && potFactoryConfig !== undefined) {
      const isPotFactoryOwner = accountId === potFactoryConfig.owner;
      const isPotFactoryAdmin = potFactoryConfig.admins.includes(accountId);
      const isPotFactoryAdminOrGreater = isPotFactoryAdmin || isPotFactoryOwner;

      const isPotFactoryWhitelistedDeployer =
        potFactoryConfig.whitelisted_deployers.includes(accountId);

      const isPotFactoryWhitelistedDeployerOrGreater =
        isPotFactoryWhitelistedDeployer || isPotFactoryAdminOrGreater;

      return {
        isPotFactoryOwner,
        isPotFactoryAdmin,
        isPotFactoryAdminOrGreater,
        isPotFactoryWhitelistedDeployer,
        isPotFactoryWhitelistedDeployerOrGreater,

        canDeployPots:
          !potFactoryConfig.require_whitelist || isPotFactoryWhitelistedDeployerOrGreater,
      };
    } else {
      return {
        isPotFactoryOwner: false,
        isPotFactoryAdmin: false,
        isPotFactoryAdminOrGreater: false,
        isPotFactoryWhitelistedDeployer: false,
        isPotFactoryWhitelistedDeployerOrGreater: false,
        canDeployPots: false,
      };
    }
  }, [accountId, isAccountIdValid, potFactoryConfig]);

  return {
    isLoading: isPotFactoryConfigLoading,
    data: power,
    error: potFactoryConfigLoadingError,
  };
};
