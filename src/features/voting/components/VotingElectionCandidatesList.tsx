import { Candidate, Vote } from "@/common/contracts/core/voting";

import {
  VotingElectionCandidateEntry,
  VotingElectionCandidateEntryProps,
} from "./VotingElectionCandidateEntry";

export type VotingElectionCandidatesListProps = {
  data: Candidate[];
  onEntrySelect?: VotingElectionCandidateEntryProps["onSelect"];
};

export const VotingElectionCandidatesList: React.FC<VotingElectionCandidatesListProps> = ({
  data,
  onEntrySelect,
}) => {
  const electionVotes: Vote[] = [];

  return (
    <div className="flex flex-col">
      {data.map((candidate) => (
        <VotingElectionCandidateEntry
          key={candidate.account_id}
          electionVotes={electionVotes}
          onSelect={onEntrySelect}
          {...candidate}
        />
      ))}
    </div>
  );
};
