import { useMemo, useState } from "react";

import { values } from "remeda";

import type { ByPotId } from "@/common/api/indexer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/common/ui/components";
import { cn } from "@/common/ui/utils";

import { VotingRoundVoteRow } from "./VoteRow";
import { VotingRoundWinnerRow } from "./WinnerRow";
import { useVotingRoundResults } from "../hooks/results";
import { sortByAccumulatedWeight } from "../utils/weight";

export type VotingRoundResultsTableProps = ByPotId & {};

export const VotingRoundResultsTable: React.FC<VotingRoundResultsTableProps> = ({ potId }) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const roundResults = useVotingRoundResults({ potId });

  console.log(expandedRows);

  const rows = useMemo(
    () =>
      roundResults.data === undefined
        ? null
        : sortByAccumulatedWeight(values(roundResults.data.winners), "desc").map(
            (winner, index) => (
              <AccordionItem key={winner.accountId} value={winner.accountId}>
                <AccordionTrigger
                  className={cn("py-0 underline-offset-4 hover:bg-[#FEF6EE]", {
                    "bg-neutral-50/40": expandedRows.includes(winner.accountId),
                  })}
                >
                  <VotingRoundWinnerRow key={winner.accountId} data={winner} rank={index + 1} />
                </AccordionTrigger>

                <AccordionContent className="gap-3 bg-neutral-50/40 px-6 pt-3">
                  <div
                    className={cn(
                      "flex justify-between text-nowrap rounded-lg",
                      "bg-neutral-50 text-xs text-neutral-500",
                    )}
                  >
                    <div className="mr-a inline-flex h-10 items-center justify-start gap-2 px-4 py-2">
                      <span className="font-600 uppercase leading-none">{"Voters"}</span>
                    </div>

                    <div className="hidden md:flex">
                      <div className="flex h-10 items-center px-4 py-2">
                        <span className="font-600 w-80 text-end uppercase leading-none">
                          {"Weight amplifiers"}
                        </span>
                      </div>

                      <div className="flex h-10 items-center px-4 py-2">
                        <span className="font-600 w-14 text-end uppercase leading-none">
                          {"Weight"}
                        </span>
                      </div>

                      <span className="flex h-10 items-center px-4 py-2">
                        <span className="w-50 font-600 text-end uppercase leading-none">
                          {"Timestamp"}
                        </span>
                      </span>
                    </div>
                  </div>

                  {winner.votes.map((vote) => (
                    <VotingRoundVoteRow
                      key={vote.timestamp + vote.voter}
                      compact
                      data={vote}
                      {...{ potId }}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            ),
          ),

    [expandedRows, potId, roundResults.data],
  );

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

        <div className="mr-6 hidden md:flex">
          <div className="flex h-10 items-center px-4 py-2">
            <span className="font-600 w-24 text-end uppercase leading-none">{"Votes"}</span>
          </div>

          <div className="flex h-10 items-center px-4 py-2">
            <span className="w-30.5 font-600 text-end uppercase leading-none">
              {"Total Weight"}
            </span>
          </div>

          <span className="flex h-10 items-center px-4 py-2">
            <span className="w-50 font-600 text-end uppercase leading-none">
              {"Pool Allocation"}
            </span>
          </span>
        </div>
      </div>

      <Accordion asChild type="multiple" onValueChange={setExpandedRows}>
        <div className="flex flex-col pb-8">{rows}</div>
      </Accordion>
    </section>
  );
};
