import type { Account } from "@/common/api/indexer";
import type { ProfileLinktree } from "@/common/contracts/social-db";
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

export enum AccountCategory {
  "Social Impact" = "Social Impact",
  "Non Profit" = "Non Profit",
  "Climate" = "Climate",
  "Public Good" = "Public Good",
  "DeSci" = "DeSci",
  "Open Source" = "Open Source",
  "Community" = "Community",
  "Education" = "Education",
}

export type AccountCategoryVariant = keyof typeof AccountCategory;

export type AccountCategoryOption = {
  label: string;
  val: AccountCategoryVariant;
};

export type AccountSnapshot = Account;
