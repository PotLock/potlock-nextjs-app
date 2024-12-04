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
  /**
   * Returns the contract source metadata
   */
  contract_source_metadata(): Promise<string>;

  /**
   * Creates a new election
   * @returns The ID of the created election
   */
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

  /**
   * Returns all active elections
   */
  get_active_elections(): Promise<[number, Election][]>;

  /**
   * Returns the vote count for a specific candidate in an election
   */
  get_candidate_vote_count(args: { election_id: number; candidate_id: AccountId }): Promise<number>;

  /**
   * Returns the vote weight for a specific candidate in an election
   */
  get_candidate_vote_weight(args: {
    election_id: number;
    candidate_id: AccountId;
  }): Promise<number>;

  /**
   * Returns all votes for a specific candidate in an election
   */
  get_candidate_votes(args: { election_id: number; candidate_id: AccountId }): Promise<Vote[]>;

  /**
   * Returns details of a specific election
   */
  get_election(args: { election_id: number }): Promise<Election | null>;

  /**
   * Returns all candidates in a specific election
   */
  get_election_candidates(args: { election_id: number }): Promise<Candidate[]>;

  /**
   * Returns the current phase of a specific election
   */
  get_election_phase(args: { election_id: number }): Promise<ElectionPhase | null>;

  /**
   * Returns the results of a specific election
   */
  get_election_results(args: { election_id: number }): Promise<[AccountId, number][]>;

  /**
   * Returns the total vote count for a specific election
   */
  get_election_vote_count(args: { election_id: number }): Promise<number>;

  /**
   * Returns all votes in a specific election
   */
  get_election_votes(args: { election_id: number }): Promise<Vote[]>;

  /**
   * Returns a paginated list of elections
   */
  get_elections(args: { from_index?: number; limit?: number }): Promise<Election[]>;

  /**
   * Returns all elections created by a specific account
   */
  get_elections_by_creator(args: { creator: AccountId }): Promise<[number, Election][]>;

  /**
   * Returns the remaining time for a specific election
   */
  get_time_remaining(args: { election_id: number }): Promise<number | null>;

  /**
   * Returns the remaining voting capacity for a voter in an election
   */
  get_voter_remaining_capacity(args: {
    election_id: number;
    voter: AccountId;
  }): Promise<number | null>;

  /**
   * Returns all votes by a specific voter in an election
   */
  get_voter_votes(args: { election_id: number; voter: AccountId }): Promise<Vote[] | null>;

  /**
   * Checks if a voter has participated in an election
   */
  has_voter_participated(args: { election_id: number; voter: AccountId }): Promise<boolean>;

  /**
   * Checks if an election has ended
   */
  is_election_ended(args: { election_id: number }): Promise<boolean>;

  /**
   * Checks if an election is currently in the voting period
   */
  is_voting_period(args: { election_id: number }): Promise<boolean>;

  /**
   * Casts a vote in an election
   * @returns Success status of the vote
   */
  vote(args: { election_id: number; vote: [AccountId, number] }): Promise<boolean>;

  /**
   * Pauses the contract
   */
  pause(): Promise<void>;

  /**
   * Unpauses the contract
   */
  unpause(): Promise<void>;
}
