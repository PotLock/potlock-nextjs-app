import { values } from "remeda";

import { type ByPotId } from "@/common/api/indexer";
import { NATIVE_TOKEN_DECIMALS, NATIVE_TOKEN_ID } from "@/common/constants";
import { indivisibleUnitsToFloat } from "@/common/lib";
import { LabeledIcon, Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { AccountHandle, AccountProfilePicture } from "@/entities/_shared/account";
import { TokenIcon } from "@/entities/_shared/token";

import { useVotingRoundResults } from "../hooks/results";

const VotingRoundLeaderboardItemsPlaceholder = () =>
  Array.from({ length: 3 }).map((_, index) => (
    <Skeleton key={index} className="h-16 w-full rounded-2xl" />
  ));

export type VotingRoundLeaderboardProps = ByPotId & {};

export const VotingRoundLeaderboard: React.FC<VotingRoundLeaderboardProps> = ({ potId }) => {
  const votingRoundResults = useVotingRoundResults({ potId });

  return (
    <div className="md:max-w-126.5 flex h-60 w-full flex-col gap-3 overflow-y-scroll rounded-3xl bg-neutral-50 p-3">
      {votingRoundResults.data === undefined && <VotingRoundLeaderboardItemsPlaceholder />}

      {votingRoundResults.data !== undefined &&
        values(votingRoundResults.data.winners).map(
          ({ rank, accountId, votes, accumulatedWeight, estimatedPayoutAmount }) => {
            return (
              <div
                key={accountId}
                className={cn(
                  "elevation-low inline-flex h-16 min-h-16 items-center justify-start gap-2 md:gap-6",
                  "bg-background overflow-hidden rounded-2xl p-3",
                )}
                style={{ order: rank }}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center",
                    "rounded-full border border-neutral-200",
                  )}
                >
                  <span className="text-right text-xs font-medium leading-none">{rank}</span>
                </div>

                <div className="flex h-10 shrink grow basis-0 items-center justify-start gap-4">
                  <AccountProfilePicture className="h-10 w-10" {...{ accountId }} />

                  <div
                    className={
                      "inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1"
                    }
                  >
                    <AccountHandle
                      maxLength={22}
                      className="font-600 text-neutral-950"
                      {...{ accountId }}
                    />

                    <div className="self-stretch text-sm font-medium leading-tight text-neutral-500">
                      {`${votes.length} votes / total weight ${accumulatedWeight}`}
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
                    caption={indivisibleUnitsToFloat(
                      estimatedPayoutAmount,
                      NATIVE_TOKEN_DECIMALS,
                      2,
                    )}
                    classNames={{
                      caption: "font-600 text-sm gap-1.5 text-nowrap",
                    }}
                  >
                    <TokenIcon tokenId={NATIVE_TOKEN_ID} className="color-peach-600" />
                  </LabeledIcon>
                </div>
              </div>
            );
          },
        )}
    </div>
  );
};
