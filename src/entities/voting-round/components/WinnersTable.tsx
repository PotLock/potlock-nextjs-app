import { useMemo } from "react";

import { values } from "remeda";

import type { ByPotId } from "@/common/api/indexer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/common/ui/components";

import { VotingRoundVoteRow } from "./VoteRow";
import { VotingRoundWinnerRow } from "./WinnerRow";
import { useVotingRoundResults } from "../hooks/results";
import { sortByAccumulatedWeight } from "../utils/weight";

export type VotingRoundWinnersTableProps = ByPotId & {};

export const VotingRoundWinnersTable: React.FC<VotingRoundWinnersTableProps> = ({ potId }) => {
  const votingRoundResults = useVotingRoundResults({ potId });

  const rows = useMemo(
    () =>
      votingRoundResults.data === undefined
        ? null
        : sortByAccumulatedWeight(values(votingRoundResults.data.winners)).map((winner, index) => (
            <AccordionItem key={winner.accountId} value={winner.accountId}>
              <AccordionTrigger className="py-0 underline-offset-4 hover:bg-[#FEF6EE]">
                <VotingRoundWinnerRow key={winner.accountId} data={winner} rank={index + 1} />
              </AccordionTrigger>

              <AccordionContent className="gap-3">
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
          )),

    [potId, votingRoundResults.data],
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
            <span className="font-600 w-24 max-w-24 text-end uppercase leading-none">
              {"Votes"}
            </span>
          </div>

          <div className="flex h-10 items-center px-4 py-2">
            <span className="max-w-30.5 w-30.5 font-600 text-end text-end uppercase leading-none">
              {"Total Weight"}
            </span>
          </div>

          <span className="flex h-10 items-center px-4 py-2">
            <span className="w-50 max-w-50 font-600 text-end uppercase leading-none">
              {"Pool Allocation"}
            </span>
          </span>
        </div>
      </div>

      <Accordion asChild type="multiple">
        <div className="flex flex-col pb-8">{rows}</div>
      </Accordion>
    </section>
  );
};
