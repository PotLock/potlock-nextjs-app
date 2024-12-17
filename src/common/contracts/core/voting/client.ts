import naxios, { MemoryCache } from "@wpdas/naxios";

import { naxiosInstance } from "@/common/api/near";

import type {
  AccountId,
  Candidate,
  Election,
  ElectionId,
  ElectionPhase,
  ElectionType,
  EligibilityType,
  IVotingContract,
  Vote,
  VoteInputs,
  VotingType,
} from "./interfaces";

/**
 * Client implementation for interacting with the Voting smart contract
 * Provides methods to create and manage elections, cast votes, and query election data
 */
class VotingClient implements Omit<IVotingContract, "new"> {
  private contract: ReturnType<typeof naxios.prototype.contractApi>;

  /**
   * Creates a new VotingClient instance
   * @param contractId The NEAR account ID of the deployed voting contract
   * @param network The NEAR network to connect to (mainnet, testnet, etc.)
   */
  constructor(naxiosInstance: naxios, contractId: string) {
    this.contract = naxiosInstance.contractApi({
      contractId,
      cache: new MemoryCache({ expirationTime: 60 }),
    });
  }

  // View Methods

  /**
   * Returns the contract source metadata
   *
   * Useful for verifying contract version and authenticity
   */
  async contract_source_metadata(): Promise<string> {
    return this.contract.view("contract_source_metadata", { args: {} });
  }

  /**
   * Returns all currently active elections
   *
   * An election is considered active during its voting period
   */
  async get_active_elections(): Promise<[number, Election][]> {
    return this.contract.view("get_active_elections", { args: {} });
  }

  /**
   * Returns the total number of votes received by a candidate in an election
   * @param election_id The ID of the election
   * @param candidate_id The account ID of the candidate
   */
  async get_candidate_vote_count(args: {
    election_id: ElectionId;
    candidate_id: AccountId;
  }): Promise<number> {
    return this.contract.view("get_candidate_vote_count", { args });
  }

  /**
   * Returns the total vote weight received by a candidate in an election
   *
   * Only relevant for weighted voting type elections
   */
  async get_candidate_vote_weight(args: {
    election_id: ElectionId;
    candidate_id: AccountId;
  }): Promise<number> {
    return this.contract.view("get_candidate_vote_weight", { args });
  }

  /**
   * Returns all votes cast for a specific candidate in an election
   *
   * Includes voter information and vote weights
   */
  async get_candidate_votes(args: {
    election_id: ElectionId;
    candidate_id: AccountId;
  }): Promise<Vote[]> {
    return this.contract.view("get_candidate_votes", { args });
  }

  /**
   * Returns detailed information about a specific election
   *
   * Returns null or undefined if the election doesn't exist
   */
  async get_election(args: { election_id: ElectionId }): Promise<Election | null | undefined> {
    return this.contract.view("get_election", { args });
  }

  /**
   * Returns the list of all candidates in an election
   *
   * Includes their vote counts and vote weights
   */
  async get_election_candidates(args: { election_id: ElectionId }): Promise<Candidate[]> {
    return this.contract.view("get_election_candidates", { args });
  }

  /**
   * Returns the current phase of an election
   *
   * Can be Registration, Voting, or Ended
   */
  async get_election_phase(args: {
    election_id: ElectionId;
  }): Promise<ElectionPhase | null | undefined> {
    return this.contract.view("get_election_phase", { args });
  }

  /**
   * Returns the final results of an election
   *
   * Returns array of [candidate_id, vote_count] pairs
   */
  async get_election_results(args: { election_id: ElectionId }): Promise<[AccountId, number][]> {
    return this.contract.view("get_election_results", { args });
  }

  /**
   * Returns the total number of votes cast in an election
   */
  async get_election_vote_count(args: { election_id: ElectionId }) {
    return this.contract.view<typeof args, number>("get_election_vote_count", { args });
  }

  /**
   * Returns all votes cast in an election
   */
  async get_election_votes(args: { election_id: ElectionId }) {
    return this.contract.view<typeof args, Vote[]>("get_election_votes", { args });
  }

  /**
   * Returns a paginated list of all elections
   * @param from_index Optional starting index for pagination
   * @param limit Optional maximum number of elections to return
   */
  async get_elections(args: { from_index?: number; limit?: number }) {
    return this.contract.view<typeof args, Election[]>("get_elections", { args });
  }

  /**
   * Returns all elections created by a specific account
   */
  async get_elections_by_creator(args: { creator: AccountId }): Promise<[number, Election][]> {
    return this.contract.view("get_elections_by_creator", { args });
  }

  /**
   * Returns the time remaining until an election ends
   *
   * Returns null or undefined if the election has ended or doesn't exist
   */
  async get_time_remaining(args: { election_id: ElectionId }) {
    return this.contract.view<typeof args, number | null | undefined>("get_time_remaining", {
      args,
    });
  }

  /**
   * Returns how many more votes a voter can cast in an election
   *
   * Based on the election's votes_per_voter limit
   */
  async get_voter_remaining_capacity(args: { election_id: ElectionId; voter: AccountId }) {
    return this.contract.view<typeof args, number | null | undefined>(
      "get_voter_remaining_capacity",
      { args },
    );
  }

  /**
   * Returns all votes cast by a specific voter in an election
   */
  async get_voter_votes(args: { election_id: ElectionId; voter: AccountId }) {
    return this.contract.view<typeof args, Vote[] | null | undefined>("get_voter_votes", { args });
  }

  async get_unique_voters(args: { election_id: ElectionId }) {
    return this.contract.view<typeof args, AccountId[]>("get_unique_voters", { args });
  }

  /**
   * Checks if a voter has cast any votes in an election
   */
  async has_voter_participated(args: { election_id: ElectionId; voter: AccountId }) {
    return this.contract.view<typeof args, boolean>("has_voter_participated", { args });
  }

  /**
   * Checks if an election has ended
   *
   * Based on the current time and election end_date
   */
  async is_election_ended(args: { election_id: ElectionId }): Promise<boolean> {
    return this.contract.view("is_election_ended", { args });
  }

  /**
   * Checks if an election is currently in its voting period
   *
   * Based on the current time and election start_date/end_date
   */
  async is_voting_period(args: { election_id: ElectionId }) {
    return this.contract.view<typeof args, boolean>("is_voting_period", { args });
  }

  // Change Methods

  /**
   * Creates a new election
   * @param title The title of the election
   * @param description A description of the election
   * @param start_date When voting begins (ISO date string)
   * @param end_date When voting ends (ISO date string)
   * @param votes_per_voter Maximum number of votes each voter can cast
   * @param voter_eligibility Rules for who can vote
   * @param voting_type The type of voting mechanism
   * @param election_type The type of election
   * @param candidates List of candidate account IDs
   * @returns The ID of the newly created election
   */
  async create_election(args: {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    votes_per_voter: number;
    voter_eligibility: EligibilityType;
    voting_type: VotingType;
    election_type: ElectionType;
    candidates: AccountId[];
  }): Promise<number> {
    return this.contract.call("create_election", { args });
  }

  /**
   * Casts a vote in an election
   * @param election_id The ID of the election
   * @param vote Tuple of [candidate_id, vote_weight]
   * @returns Success status of the vote
   */
  async vote(args: { election_id: ElectionId; vote: VoteInputs }) {
    return this.contract.call<typeof args, boolean>("vote", { args });
  }

  /**
   * Batch vote cast wrapper around {@link vote}
   */
  async voteBatch({ election_id, votes }: { election_id: ElectionId; votes: VoteInputs[] }) {
    return this.contract.callMultiple<{ election_id: ElectionId; vote: VoteInputs }>(
      votes.map((voteInputs) => ({ method: "vote", args: { election_id, vote: voteInputs } })),
    );
  }

  /**
   * Pauses all contract operations
   *
   * Can only be called by the contract owner
   */
  async pause(): Promise<void> {
    return this.contract.call("pause", { args: {} });
  }

  /**
   * Unpauses contract operations
   *
   * Can only be called by the contract owner
   */
  async unpause(): Promise<void> {
    return this.contract.call("unpause", { args: {} });
  }
}

/**
 * Creates a new VotingClient instance
 * @param contractId The NEAR account ID of the deployed voting contract
 * @param network The NEAR network to connect to
 */
export const createVotingClient = (contractId: string): VotingClient =>
  new VotingClient(naxiosInstance, contractId);
