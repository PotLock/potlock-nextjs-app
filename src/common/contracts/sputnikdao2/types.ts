import type { AccountId, IndivisibleUnits } from "@/common/types";

// pub enum WeightOrRatio {
//     Weight(U128),
//     Ratio(u64, u64),
// }

export enum WeightOrRatio {
  Weight = "Weight",
  Ratio = "Ratio",
}

/**
 * How the voting policy votes get weigthed.
 */
export enum WeightKind {
  /**
   * Using token amounts and total delegated at the moment.
   */
  TokenWeight = "TokenWeight",

  /**
   * Weight of the group role. Roles that don't have scoped group are not supported.
   */
  RoleWeight = "RoleWeight",
}

export type VotePolicy = {
  weight_kind: WeightKind;
  quorum: IndivisibleUnits;
  threshold: WeightOrRatio;
};

// pub enum RoleKind {
//     /// Matches everyone, who is not matched by other roles.
//     Everyone,
//     /// Member greater or equal than given balance. Can use `1` as non-zero balance.
//     Member(U128),
//     /// Set of accounts.
//     Group(HashSet<AccountId>),
// }

export enum RoleKind {
  /**
   * Matches everyone, who is not matched by other roles.
   */
  Everyone = "Everyone",

  /**
   * Member greater or equal than given balance. Can use `1` as non-zero balance.
   */
  Member = "Member",

  /**
   * Set of accounts.
   */
  Group = "Group",
}

export type RolePermission = {
  name: string;
  kind: RoleKind;
  permissions: string[];
  vote_policy: Record<string, VotePolicy>;
};

export type Policy = {
  /// List of roles and permissions for them in the current policy.
  roles: RolePermission[];

  /**
   * Default vote policy. Used when given proposal kind doesn't have special policy.
   */
  default_vote_policy: VotePolicy;

  /**
   * Proposal bond.
   */
  proposal_bond: IndivisibleUnits;

  /**
   * Expiration period for proposals.
   */
  proposal_period: number;

  /**
   * Bond for claiming a bounty.
   */
  bounty_bond: IndivisibleUnits;

  /**
   * Period in which giving up on bounty is not punished.
   */
  bounty_forgiveness_period: number;
};
