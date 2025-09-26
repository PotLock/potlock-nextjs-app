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
  Group: AccountId[];
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

export type ActionCall = {
  method_name: string;

  /**
   * Base64 encoded JSON args
   */
  args: string;

  deposit: IndivisibleUnits;
  gas: number;
};

export enum ProposalStatus {
  InProgress = "InProgress",

  /**
   * If quorum voted yes, this proposal is successfully approved.
   */
  Approved = "Approved",

  /**
   * If quorum voted no, this proposal is rejected. Bond is returned.
   */
  Rejected = "Rejected",

  /**
   * If quorum voted to remove (e.g. spam), this proposal is rejected and bond is not returned.
   * Interfaces shouldn't show removed proposals.
   */
  Removed = "Removed",

  /**
   * Expired after period of time.
   */
  Expired = "Expired",

  /**
   * If proposal was moved to Hub or somewhere else.
   */
  Moved = "Moved",

  /**
   * If proposal has failed when finalizing.
   * Allowed to re-finalize again to either expire or approved.
   */
  Failed = "Failed",
}

export type ProposalLog = {
  block_height: number;
};

export type FunctionCallProposal = {
  receiver_id: AccountId;
  actions: ActionCall[];
};

/**
 * Proposal kind.
 *
 * Note that this is a bare minimum client binding for the original SputnikDAO `ProposalKind` enum,
 * covering only a narrow set of use cases of the app.
 */
export type ProposalKind = "Vote" | { FunctionCall: FunctionCallProposal };

export enum Vote {
  Approve = 0,
  Reject = 1,
  Remove = 2,
}

export type Proposal = {
  proposer: AccountId;
  description: string;

  /**
   * Kind of proposal with relevant information.
   */
  kind: ProposalKind;

  /**
   * Current status of the proposal.
   */
  status: ProposalStatus;

  /**
   * Count of votes per role per decision: yes / no / spam.
   */
  vote_counts: Record<string, [IndivisibleUnits, IndivisibleUnits, IndivisibleUnits]>;

  /**
   * Map of who voted and how.
   */
  votes: Record<AccountId, Vote>;

  /**
   * Submission time (for voting period).
   */
  submission_time: number;

  last_actions_log: ProposalLog[];
};

export type ProposalId = number;

export type ProposalOutput = Proposal & {
  id: number;
};
