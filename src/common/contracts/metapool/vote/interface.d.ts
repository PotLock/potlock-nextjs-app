import { AccountId } from "@/common/types";

export type MpDaoVoter = {
  voter_id: AccountId;
  balance_in_contract: string;

  locking_positions: {
    index: number;
    amount: string;
    locking_period: number;
    voting_power: string;
    unlocking_started_at: number | null;
    is_unlocked: boolean;
    is_unlocking: boolean;
    is_locked: boolean;
  }[];

  voting_power: string;

  vote_positions: {
    votable_address: string;
    votable_object_id: string;
    voting_power: string;
  }[];
};
