import { ByPotId } from "@/common/api/indexer";
import { Candidate } from "@/common/contracts/core/voting";
import { ScrollArea } from "@/common/ui/components";

import { VotingCandidateListItem, VotingCandidateListItemProps } from "./VotingCandidateListItem";

export const VotingCandidatesTableHead = () => (
  <div className="flex justify-between bg-neutral-50 text-xs text-neutral-500">
    {/* <div className="inline-flex h-10 w-12 px-4 py-2" /> */}

    <div className="inline-flex h-10 items-center justify-start gap-2 px-4 py-2">
      <span className="font-600 shrink grow basis-0 uppercase leading-none">{"Projects"}</span>
    </div>

    <div className="hidden md:flex">
      <div className="flex h-10 w-24 items-center px-4 py-2">
        <span className="font-600 shrink grow basis-0 text-right uppercase leading-none">
          {"Votes"}
        </span>
      </div>

      <div className="flex h-10 w-24 items-center px-4 py-2">
        <span className="font-600 shrink grow basis-0 text-center uppercase leading-none">
          {"Actions"}
        </span>
      </div>
    </div>
  </div>
);

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
