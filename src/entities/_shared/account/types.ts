import type { ProfileLinktree } from "@/common/contracts/social";
import { ByAccountId, ByRegistrationId } from "@/common/types";

export type AccountPower = {
  isPotFactoryOwner: boolean;
  isPotFactoryAdmin: boolean;
  isPotFactoryAdminOrGreater: boolean;
  isPotFactoryWhitelistedDeployer: boolean;
  isPotFactoryWhitelistedDeployerOrGreater: boolean;
  canDeployPots: boolean;
};

export type AccountGroupItem = ByAccountId &
  Partial<ByRegistrationId> & {
    isNew?: boolean;
  };

export type AccountProfileLinktreeKey = keyof ProfileLinktree;
