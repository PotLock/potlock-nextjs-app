import { ByPotId } from "@/common/api/indexer";
import { Candidate } from "@/common/contracts/core/voting";
import { ScrollArea } from "@/common/ui/components";

import { VotingCandidateListItem, VotingCandidateListItemProps } from "./VotingCandidateListItem";

export type VotingCandidateListProps = ByPotId & {
  data: Candidate[];
  onEntrySelect?: VotingCandidateListItemProps["onSelect"];
};

export const VotingCandidateList: React.FC<VotingCandidateListProps> = ({
  potId,
  data,
  onEntrySelect,
}) => {
  // TODO: Use VirtualScroll for better performance
  return (
    <ScrollArea>
      <div className="flex flex-col">
        {data.map((candidate) => (
          <VotingCandidateListItem
            key={candidate.account_id}
            data={candidate}
            onSelect={onEntrySelect}
            {...{ potId }}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
