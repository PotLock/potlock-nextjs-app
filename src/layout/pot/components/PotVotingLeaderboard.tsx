import type { ByPotId } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { cn } from "@/common/ui/utils";
import { AccountHandle, AccountProfilePicture } from "@/entities/account";
import { TokenIcon } from "@/entities/token";

const DUMMY_LEADERBOARD = [
  {
    accountId: "creativesportfolio.near",
    votesReceived: 800,
    amount: 764.81,
  },
];

export type PotVotingLeaderboardProps = ByPotId & {};

export const PotVotingLeaderboard: React.FC<PotVotingLeaderboardProps> = () => (
  <div className="flex h-56 w-full flex-col rounded-3xl bg-neutral-50 p-3 md:h-60 md:max-w-96">
    {DUMMY_LEADERBOARD.map(({ accountId, votesReceived, amount }, index) => (
      <div
        key={accountId}
        className={cn(
          "elevation-low inline-flex h-16 items-center justify-start gap-6",
          "overflow-hidden rounded-2xl p-3",
        )}
      >
        <div
          className={
            "flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200"
          }
        >
          <span className="text-right text-xs font-medium leading-none">{index + 1}</span>
        </div>

        <div className="flex h-10 shrink grow basis-0 items-center justify-start gap-4">
          <AccountProfilePicture className="h-10 w-10" {...{ accountId }} />

          <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start">
            <AccountHandle {...{ accountId }} />

            <div className="self-stretch text-sm font-medium leading-tight text-neutral-500">
              {`${votesReceived} votes`}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center justify-center gap-1.5",
            "rounded-lg bg-orange-100 py-1.5 pl-2 pr-3",
          )}
        >
          <TokenIcon tokenId={NATIVE_TOKEN_ID} />

          <div className="text-right text-sm font-semibold leading-tight text-orange-950">
            {amount}
          </div>
        </div>
      </div>
    ))}
  </div>
);
