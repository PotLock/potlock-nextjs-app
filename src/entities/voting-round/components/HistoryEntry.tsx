import { useMemo } from "react";

import { MdOutlineTimer } from "react-icons/md";
import { Temporal } from "temporal-polyfill";

import type { ByPotId } from "@/common/api/indexer";
import type { Vote } from "@/common/contracts/core/voting";
import { cn } from "@/common/ui/utils";
import {
  AccountHandle,
  AccountProfileLink,
  AccountProfilePicture,
} from "@/entities/_shared/account";

import { VotingRoundVoteWeightBoostBadge } from "./badges";
import { useVotingRoundVoterVoteWeightAmplifiers } from "../hooks/vote-weight";

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

  const voteWeightAmplifiers = useVotingRoundVoterVoteWeightAmplifiers({
    potId,
    accountId: voterAccountId,
  });

  return (
    <div
      className={cn(
        "flex w-full flex-col justify-between gap-6 lg:items-center lg:gap-3",
        "rounded-2xl border p-5 lg:flex-row",
      )}
    >
      <div className="flex w-full max-w-[360px] items-center gap-4">
        <AccountProfilePicture accountId={voterAccountId} className="h-12 min-h-12 w-12 min-w-12" />

        <div className="flex w-full flex-col gap-3">
          <AccountHandle accountId={voterAccountId} />

          <div className="flex w-full items-center gap-1">
            <span className="text-nowrap text-[17px] font-normal">{"Voted for"}</span>
            <AccountProfileLink accountId={candidateAccountId} />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "inline-flex flex-col flex-wrap items-start justify-start gap-3",
          "w-full lg:w-fit lg:flex-row lg:items-center lg:justify-center",
        )}
      >
        {voteWeightAmplifiers.map((amplifier) => (
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
