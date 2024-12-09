import { Candidate, Vote } from "@/common/contracts/core/voting";
import { ScrollArea } from "@/common/ui/components";

import { VotingCandidateListItem, VotingCandidateListItemProps } from "./VotingCandidateListItem";

export type VotingCandidateListProps = {
  data: Candidate[];
  onEntrySelect?: VotingCandidateListItemProps["onSelect"];
};

export const VotingCandidateList: React.FC<VotingCandidateListProps> = ({
  data,
  onEntrySelect,
}) => {
  const votes: Vote[] = [];

  // TODO: Use VirtualScroll for better performance
  return (
    <ScrollArea>
      <div className="flex flex-col">
        {data.map((candidate) => (
          <VotingCandidateListItem
            key={candidate.account_id}
            votes={votes.filter(({ candidate_id }) => candidate_id === candidate.account_id)}
            onSelect={onEntrySelect}
            {...candidate}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
