import { useMemo } from "react";

import { LuEqual } from "react-icons/lu";
import { MdHowToVote, MdOutlineTimer } from "react-icons/md";
import { Temporal } from "temporal-polyfill";

import type { ByPotId } from "@/common/api/indexer";
import type { Vote } from "@/common/contracts/core/voting";
import { Skeleton } from "@/common/ui/components";
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
  className?: string;
};

export const VotingRoundVoteRow: React.FC<VotingRoundVoteRowProps> = ({
  potId,
  data: { candidate_id: candidateAccountId, voter: voterAccountId, timestamp },
  compact = false,
  className,
}) => {
  const timeStatus = useMemo(
    () => (
      <div className="inline-flex flex-nowrap items-center gap-1.5">
        <MdOutlineTimer className="h-5 w-5 text-[#7a7a7a]" />

        <span
          className={"text-nowrap text-center text-[17px] font-normal leading-6 text-[#7a7a7a]"}
        >
          {Temporal.Instant.fromEpochMilliseconds(timestamp).toLocaleString(undefined, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h24",
          })}
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
      className={cn(
        "flex w-full flex-col flex-nowrap items-center justify-between gap-6",
        "bg-background rounded-2xl border px-5 py-5 lg:flex-row lg:gap-0",

        {
          "px-4 py-2": compact,
        },

        className,
      )}
    >
      {compact ? (
        <div className="flex w-[252px] items-center gap-2">
          <AccountProfileLink accountId={voterAccountId} />
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
                  maxLength={20}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-row items-center">
        {voterSummary && (
          <>
            {voterSummary.vote.weight > 0 ? (
              <>
                {!compact && <span className="font-500 mr-3">Weight:</span>}

                <div className={cn("flex w-fit items-center justify-center gap-3")}>
                  {voterSummary?.vote.amplifiers.map((amplifier) =>
                    amplifier.isApplicable ? (
                      <VotingRoundVoteWeightBoostBadge
                        key={amplifier.name + amplifier.amplificationPercent}
                        data={amplifier}
                      />
                    ) : null,
                  )}
                </div>

                <LuEqual className="ml-3 h-4 w-4" />
              </>
            ) : (
              !compact && <span className="font-500">Weight:</span>
            )}
          </>
        )}

        <div className="inline-flex h-16 items-center overflow-hidden px-4 py-2">
          {voterSummary ? (
            <span className="font-600 w-10 max-w-10 text-end uppercase leading-none">
              {voterSummary?.vote.weight}
            </span>
          ) : (
            <Skeleton className="h-5 w-10" />
          )}
        </div>

        <div className="inline-flex h-16 items-center overflow-hidden px-4 py-2 pr-0">
          <span className="w-50 max-w-50 font-600 text-end uppercase leading-none">
            {timeStatus}
          </span>
        </div>
      </div>
    </div>
  );
};
