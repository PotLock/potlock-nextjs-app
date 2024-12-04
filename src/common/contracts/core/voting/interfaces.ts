export type AccountId = string;

/**
 * Represents a vote cast in an election
 */
export interface Vote {
  voter: AccountId;
  candidate: AccountId;
  weight: number;
  timestamp: number;
}

/**
 * Represents a candidate in an election
 */
export interface Candidate {
  account_id: AccountId;
  votes: Vote[];
  vote_count: number;
  vote_weight: number;
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

/**
 * Defines the type of election
 */
export type ElectionType = {
  simple_majority?: {};
  threshold?: {
    threshold: number;
  };
};

/**
 * Represents the current phase of an election
 */
export type ElectionPhase = "Registration" | "Voting" | "Ended";

/**
 * Represents an election
 */
export interface Election {
  id: number;
  creator: AccountId;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  votes_per_voter: number;
  voter_eligibility: EligibilityType;
  voting_type: VotingType;
  election_type: ElectionType;
  candidates: Candidate[];
  total_votes: number;
  is_active: boolean;
}

/**
 * Contract interface for the voting system
 */
export interface VotingContract {
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

  get_candidate_vote_count(args: { election_id: number; candidate_id: AccountId }): Promise<number>;

  get_candidate_vote_weight(args: {
    election_id: number;
    candidate_id: AccountId;
  }): Promise<number>;

  get_candidate_votes(args: { election_id: number; candidate_id: AccountId }): Promise<Vote[]>;

  get_election(args: { election_id: number }): Promise<Election | null>;

  get_election_candidates(args: { election_id: number }): Promise<Candidate[]>;

  get_election_phase(args: { election_id: number }): Promise<ElectionPhase | null>;

  get_election_results(args: { election_id: number }): Promise<[AccountId, number][]>;

  get_election_vote_count(args: { election_id: number }): Promise<number>;

  get_election_votes(args: { election_id: number }): Promise<Vote[]>;

  get_elections(args: { from_index?: number; limit?: number }): Promise<Election[]>;

  get_elections_by_creator(args: { creator: AccountId }): Promise<[number, Election][]>;

  get_time_remaining(args: { election_id: number }): Promise<number | null>;

  get_voter_remaining_capacity(args: {
    election_id: number;
    voter: AccountId;
  }): Promise<number | null>;

  get_voter_votes(args: { election_id: number; voter: AccountId }): Promise<Vote[] | null>;

  has_voter_participated(args: { election_id: number; voter: AccountId }): Promise<boolean>;

  is_election_ended(args: { election_id: number }): Promise<boolean>;

  is_voting_period(args: { election_id: number }): Promise<boolean>;

  vote(args: { election_id: number; vote: [AccountId, number] }): Promise<boolean>;

  pause(): Promise<void>;

  unpause(): Promise<void>;
}
