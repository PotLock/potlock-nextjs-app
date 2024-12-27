import { useMemo } from "react";

import { type ByPotId, indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { votingHooks } from "@/common/contracts/core/voting";
import type { ByAccountId } from "@/common/types";
import { LabeledIcon } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { AccountHandle, AccountProfilePicture } from "@/entities/account";
import { TokenIcon } from "@/entities/token";
import { useActiveVotingRound } from "@/features/voting/hooks/rounds";

const DUMMY_LEADING_POSITIONS = [
  {
    accountId: "creativesportfolio.near",
    accumulatedWeight: 800,
    estimatedPayoutAmount: 1337,
  },
];

type PotVotingLeaderboardEntry = ByAccountId & {
  accumulatedWeight: number;
  estimatedPayoutAmount: number;
};

export type PotVotingLeaderboardProps = ByPotId & {};

export const PotVotingLeaderboard: React.FC<PotVotingLeaderboardProps> = ({ potId }) => {
  const { data: pot } = indexer.usePot({ potId });
  const votingRound = useActiveVotingRound({ potId });

  const { data: votes } = votingHooks.useElectionVotes({
    enabled: votingRound !== undefined,
    electionId: votingRound?.electionId ?? 0,
  });

  const leadingPositions: PotVotingLeaderboardEntry[] = useMemo(() => {
    if (pot && votes) {
      return DUMMY_LEADING_POSITIONS;
    } else return [];
  }, [pot, votes]);

  return (
    <div className="md:max-w-126.5 flex w-full flex-col rounded-3xl bg-neutral-50 p-3">
      {leadingPositions.map(({ accountId, accumulatedWeight, estimatedPayoutAmount }, index) => (
        <div
          key={accountId}
          className={cn(
            "elevation-low inline-flex h-16 items-center justify-start gap-2 md:gap-6",
            "bg-background overflow-hidden rounded-2xl p-3",
          )}
        >
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center",
              "rounded-full border border-neutral-200",
            )}
          >
            <span className="text-right text-xs font-medium leading-none">{index + 1}</span>
          </div>

          <div className="flex h-10 shrink grow basis-0 items-center justify-start gap-4">
            <AccountProfilePicture className="h-10 w-10" {...{ accountId }} />

            <div
              className={"inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1"}
            >
              <AccountHandle {...{ accountId }} className="font-600 text-neutral-950" />

              <div className="self-stretch text-sm font-medium leading-tight text-neutral-500">
                {`${accumulatedWeight} votes`}
              </div>
            </div>
          </div>

          <div
            className={cn(
              "bg-peach-100 flex h-fit items-center justify-center",
              "rounded-lg py-1.5 pl-2 pr-3",
            )}
          >
            <LabeledIcon
              positioning="icon-text"
              caption={estimatedPayoutAmount}
              classNames={{
                caption: "font-600 text-sm gap-1.5",
              }}
            >
              <TokenIcon tokenId={NATIVE_TOKEN_ID} className="color-peach-600" />
            </LabeledIcon>
          </div>
        </div>
      ))}
    </div>
  );
};
