export type AccountId = string;

export type ElectionId = number;

/**
 * Represents a vote cast in an election
 */
export interface Vote {
  voter: AccountId;
  candidate_id: AccountId;
  weight: number;
  timestamp: number;
}

export enum ApplicationStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

/**
 * Represents a candidate in an election
 */
export interface Candidate {
  account_id: AccountId;
  status: ApplicationStatus;
  votes_received: number;
  application_date: number;
}

/**
 * Defines the type of voter eligibility for an election
 */
export type EligibilityType = {
  token?: {
    contract_id: AccountId;
    min_balance: number;
  };
  whitelist?: AccountId[];
  public?: {};
};

/**
 * Defines the type of voting mechanism
 */
export type VotingType = {
  weighted?: {};
  single?: {};
};

export enum ElectionTypeSimple {
  GeneralElection = "GeneralElection",
}

/**
 * Defines the type of election
 */
export type ElectionType =
  | ElectionTypeSimple
  | { ProjectProposal: AccountId }
  | { Pot: AccountId }
  | { Custom: [string, AccountId | null | undefined] };

/**
 * Represents the current phase of an election
 */
export type ElectionPhase = "Registration" | "Voting" | "Ended";

export enum ElectionStatus {
  Pending = "Pending",
  NominationPeriod = "NominationPeriod",
  VotingPeriod = "VotingPeriod",
  ChallengePeriod = "ChallengePeriod",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

/**
 * Represents an election
 */
export interface Election {
  id: ElectionId;
  title: string;
  description: string;
  start_date: number;
  end_date: number;
  votes_per_voter: number;
  voting_type: VotingType;
  voter_eligibility: EligibilityType;
  owner: AccountId;
  status: ElectionStatus;
  challenge_period_end?: null | number;
  winner_ids: AccountId[];
  election_type: ElectionType;
}

/**
 * Contract interface for the voting system
 */
export interface IVotingContract {
  contract_source_metadata(): Promise<string>;

  create_election(args: {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    votes_per_voter: number;
    voter_eligibility: EligibilityType;
    voting_type: VotingType;
    election_type: ElectionType;
    candidates: AccountId[];
  }): Promise<number>;

  get_active_elections(): Promise<[number, Election][]>;

  get_candidate_vote_count(args: {
    election_id: ElectionId;
    candidate_id: AccountId;
  }): Promise<number>;

  get_candidate_vote_weight(args: {
    election_id: ElectionId;
    candidate_id: AccountId;
  }): Promise<number>;

  get_candidate_votes(args: { election_id: ElectionId; candidate_id: AccountId }): Promise<Vote[]>;

  get_election(args: { election_id: ElectionId }): Promise<Election | null | undefined>;

  get_election_candidates(args: { election_id: ElectionId }): Promise<Candidate[]>;

  get_election_phase(args: { election_id: ElectionId }): Promise<ElectionPhase | null | undefined>;

  get_election_results(args: { election_id: ElectionId }): Promise<[AccountId, number][]>;

  get_election_vote_count(args: { election_id: ElectionId }): Promise<number>;

  get_election_votes(args: { election_id: ElectionId }): Promise<Vote[]>;

  get_elections(args: { from_index?: number; limit?: number }): Promise<Election[]>;

  get_elections_by_creator(args: { creator: AccountId }): Promise<[number, Election][]>;

  get_time_remaining(args: { election_id: ElectionId }): Promise<number | null | undefined>;

  get_voter_remaining_capacity(args: {
    election_id: ElectionId;
    voter: AccountId;
  }): Promise<number | null | undefined>;

  get_voter_votes(args: {
    election_id: ElectionId;
    voter: AccountId;
  }): Promise<Vote[] | null | undefined>;

  has_voter_participated(args: { election_id: ElectionId; voter: AccountId }): Promise<boolean>;

  is_election_ended(args: { election_id: ElectionId }): Promise<boolean>;

  is_voting_period(args: { election_id: ElectionId }): Promise<boolean>;

  vote(args: { election_id: ElectionId; vote: [AccountId, number] }): Promise<boolean>;

  pause(): Promise<void>;

  unpause(): Promise<void>;
}
