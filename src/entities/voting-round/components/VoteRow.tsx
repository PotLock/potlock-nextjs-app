import { useMemo } from "react";

import { MdHowToVote, MdOutlineTimer } from "react-icons/md";
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
import { useVotingRoundResults } from "../hooks/results";

export type VotingRoundVoteRowProps = ByPotId & {
  data: Vote;
  compact?: boolean;
};

export const VotingRoundVoteRow: React.FC<VotingRoundVoteRowProps> = ({
  potId,
  data: { candidate_id: candidateAccountId, voter: voterAccountId, timestamp },
  compact = false,
}) => {
  const timeStatus = useMemo(
    () => (
      <div className="inline-flex flex-nowrap items-center gap-1.5">
        <MdOutlineTimer className="h-6 w-6 text-[#7a7a7a]" />

        <span
          className={"text-nowrap text-center text-[17px] font-normal leading-6 text-[#7a7a7a]"}
        >
          {Temporal.Instant.fromEpochMilliseconds(timestamp).toLocaleString()}
        </span>
      </div>
    ),

    [timestamp],
  );

  const votingRoundResults = useVotingRoundResults({ potId });

  const voterSummary = useMemo(
    () => votingRoundResults.data?.voters[voterAccountId],
    [voterAccountId, votingRoundResults.data?.voters],
  );

  return (
    <div
      className={cn("flex w-full flex-nowrap items-center gap-6 rounded-2xl border p-5 lg:gap-3", {
        "flex-col": !compact,
        "justify-between": compact,
      })}
    >
      {compact ? (
        <div className="lg:max-w-40% flex w-full items-center gap-2">
          {timeStatus}
          <AccountProfileLink accountId={voterAccountId} />

          {/* <span className="inline-flex flex-nowrap gap-1">
            <span className="text-[17px] font-normal">{"Voted"}</span>
          </span> */}
        </div>
      ) : (
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
                <AccountProfilePicture accountId={candidateAccountId} className="h-6 w-6" />

                <AccountHandle
                  accountId={candidateAccountId}
                  className="decoration-none text-[17px] font-semibold text-[#292929]"
                  maxLength={16}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-3",
          "w-full lg:w-fit lg:items-center lg:justify-center",
        )}
      >
        {voterSummary?.vote.amplifiers.map((amplifier) => (
          <VotingRoundVoteWeightBoostBadge
            key={amplifier.name + amplifier.amplificationPercent}
            data={amplifier}
          />
        ))}
      </div>

      <div className={cn("ml-a", { hidden: compact })}>{timeStatus}</div>
    </div>
  );
};
