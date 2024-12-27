import { type ByPotId } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { LabeledIcon } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { AccountHandle, AccountProfilePicture } from "@/entities/account";
import { TokenIcon } from "@/entities/token";
import { useVotingRoundResults } from "@/features/voting";

export type PotVotingLeaderboardProps = ByPotId & {};

export const PotVotingLeaderboard: React.FC<PotVotingLeaderboardProps> = ({ potId }) => {
  const votingRoundResults = useVotingRoundResults({ potId });

  return votingRoundResults === undefined ? null : (
    <div className="md:max-w-126.5 flex w-full flex-col rounded-3xl bg-neutral-50 p-3">
      {votingRoundResults.leadingPositionAccountIds.map((accountId, index) => {
        const { accumulatedWeight, estimatedPayoutAmount } =
          votingRoundResults.candidates[accountId];

        return (
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
                className={
                  "inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1"
                }
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
        );
      })}
    </div>
  );
};
