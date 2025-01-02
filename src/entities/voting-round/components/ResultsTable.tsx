import { useWindowSize } from "@uidotdev/usehooks";

import { ScrollArea } from "@/common/ui/components";

import type { VotingRoundWinner } from "../types";
import { VotingRoundResultRow } from "./ResultRow";

export type VotingRoundResultsTableProps = {
  data: VotingRoundWinner[];
};

// TODO: Use VirtualScroll for better performance
export const VotingRoundResultsTable: React.FC<VotingRoundResultsTableProps> = ({ data }) => {
  const { height: windowHeight } = useWindowSize();

  return (
    <section className="flex w-full flex-col">
      <div className="flex justify-between text-nowrap bg-neutral-50 text-xs text-neutral-500">
        <div className="mr-a flex">
          <div className="inline-flex h-10 items-center justify-start gap-2 px-4 py-2">
            <span className="font-600 uppercase leading-none">{"Rank"}</span>
          </div>

          <div className="inline-flex h-10 items-center justify-start gap-2 px-4 py-2">
            <span className="font-600 uppercase leading-none">{"Projects"}</span>
          </div>
        </div>

        <div className="hidden md:flex">
          <div className="flex h-10 w-24 items-center justify-end px-4 py-2">
            <span className="font-600 text-right uppercase leading-none">{"Votes"}</span>
          </div>

          <div className="w-30.5 flex h-10 items-center justify-end px-4 py-2">
            <span className="font-600 text-right uppercase leading-none">{"Total Weight"}</span>
          </div>

          <span className="w-36.5 flex h-10 h-full items-center px-4 py-2">
            <span className="font-600 text-center uppercase leading-none">{"Pool Allocation"}</span>
          </span>
        </div>
      </div>

      <ScrollArea style={{ height: (windowHeight ?? 820) - 320 }}>
        <div className="flex flex-col gap-2 pb-8 pt-2">
          {data.map((winner, index) => (
            <VotingRoundResultRow key={winner.accountId} data={winner} rank={index + 1} />
          ))}
        </div>
      </ScrollArea>
    </section>
  );
};
