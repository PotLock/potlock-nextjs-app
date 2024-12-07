import { VotingContract } from "@/common/contracts/core";

import { VotingElectionCandidateEntry } from "./VotingElectionCandidateEntry";

export type VotingElectionCandidatesListProps = {
  data: VotingContract.Candidate[];
};

export const VotingElectionCandidatesList: React.FC<VotingElectionCandidatesListProps> = ({
  data,
}) => {
  const electionVotes: VotingContract.Vote[] = [];

  return (
    <div className="mt-30 space-y-4 md:mt-1">
      {data.map((candidate) => (
        <VotingElectionCandidateEntry
          key={candidate.account_id}
          electionVotes={electionVotes}
          {...candidate}
        />
      ))}
    </div>
  );
};
