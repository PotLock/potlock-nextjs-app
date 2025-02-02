import { AccountId, IndivisibleUnits } from "@/common/types";

/**
 * u128 with 24 decimals (NEAR standard)
 */
export type VotingPower = IndivisibleUnits;

export type Voter = {
  voter_id: AccountId;
  balance_in_contract: IndivisibleUnits;

  locking_positions: {
    index: number;
    amount: string;
    locking_period: number;
    voting_power: VotingPower;
    unlocking_started_at: number | null;
    is_unlocked: boolean;
    is_unlocking: boolean;
    is_locked: boolean;
  }[];

  voting_power: VotingPower;

  vote_positions: {
    votable_address: string;
    votable_object_id: string;
    voting_power: VotingPower;
  }[];
};
