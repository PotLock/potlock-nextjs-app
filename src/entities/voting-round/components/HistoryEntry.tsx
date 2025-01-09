import { useMemo } from "react";

import { MdHowToVote, MdOutlineTimer } from "react-icons/md";
import { Temporal } from "temporal-polyfill";

import type { ByPotId } from "@/common/api/indexer";
import type { Vote } from "@/common/contracts/core/voting";
import { cn } from "@/common/ui/utils";
import { AccountHandle, AccountProfilePicture } from "@/entities/_shared/account";

import { VotingRoundVoteWeightBoostBadge } from "./badges";
import { useVotingRoundResults } from "../hooks/results";

export type VotingRoundHistoryEntryProps = ByPotId & {
  data: Vote;
};

export const VotingRoundHistoryEntry: React.FC<VotingRoundHistoryEntryProps> = ({
  potId,

  data: { candidate_id: candidateAccountId, voter: voterAccountId, timestamp },
}) => {
  const humanReadableTimestamp = useMemo(
    () => Temporal.Instant.fromEpochMilliseconds(timestamp).toLocaleString(),
    [timestamp],
  );

  const votingRoundResults = useVotingRoundResults({ potId });

  const voterSummary = useMemo(
    () => votingRoundResults.data?.voters[voterAccountId],
    [voterAccountId, votingRoundResults.data?.voters],
  );

  return (
    <div
      className={cn(
        "flex w-full flex-col justify-between gap-6 lg:items-center lg:gap-3",
        "rounded-2xl border p-5 lg:flex-row",
      )}
    >
      <div className="flex w-full max-w-[360px] items-center gap-4">
        <div
          className={cn(
            "inline-flex min-h-12 min-w-12 flex-col items-center justify-center",
            "overflow-hidden rounded-full bg-orange-100 p-3",
          )}
        >
          <MdHowToVote className="color-peach-600 h-6 w-6" />
        </div>

        <div className="flex w-full flex-col gap-3">
          <AccountHandle
            accountId={voterAccountId}
            maxLength={16}
            className="decoration-none text-[17px] font-semibold text-[#292929]"
          />

          <div className="flex w-full items-center gap-2">
            <span className="text-nowrap text-[17px] font-normal">{"Voted"}</span>
            <div className="flex items-center gap-1.5">
              <AccountProfilePicture
                accountId={candidateAccountId}
                className="h-6 w-6 rounded-full shadow-[inset_0px_0px_1px_0px_rgba(166,166,166,1.00)]"
              />
              <AccountHandle
                accountId={candidateAccountId}
                className="decoration-none text-[17px] font-semibold text-[#292929]"
                maxLength={16}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "inline-flex flex-col flex-wrap items-start justify-start gap-3",
          "w-full lg:w-fit lg:flex-row lg:items-center lg:justify-center",
        )}
      >
        {voterSummary?.vote.amplifiers.map((amplifier) => (
          <VotingRoundVoteWeightBoostBadge
            key={amplifier.name + amplifier.amplificationPercent}
            data={amplifier}
          />
        ))}
      </div>

      <div className="inline-flex flex-nowrap">
        <MdOutlineTimer className="h-6 w-6 px-[3px] text-[#7a7a7a]" />

        <span className="text-nowrap text-center text-[17px] font-normal text-[#7a7a7a]">
          {humanReadableTimestamp}
        </span>
      </div>
    </div>
  );
};
