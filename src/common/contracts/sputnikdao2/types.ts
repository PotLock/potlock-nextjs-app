import type { AccountId, IndivisibleUnits } from "@/common/types";

type Weight = {
  Weight: IndivisibleUnits;
};

type Ratio = {
  Ratio: [number, number];
};

export type WeightOrRatio = Weight | Ratio;

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

type MemberRole = {
  Member: IndivisibleUnits;
};

type GroupRole = {
  Group: [AccountId];
};

export type RoleKind = "Everyone" | MemberRole | GroupRole;

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
