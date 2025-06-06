import { useCallback, useMemo } from "react";

import { CheckedState } from "@radix-ui/react-checkbox";
import { Dot } from "lucide-react";

import { ByElectionId, Candidate } from "@/common/contracts/core/voting";
import { Button, Checkbox, Skeleton } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import { AccountListItem } from "@/entities/_shared/account";

import { useVotingRoundCandidateEntry } from "../hooks/candidates";

export type VotingRoundCandidateRowProps = ByElectionId & {
  data: Candidate;
  isSelected?: boolean;
  isVotable?: boolean;
  onSelect?: (accountId: string, isSelected: boolean) => void;
};

export const VotingRoundCandidateRow: React.FC<VotingRoundCandidateRowProps> = ({
  electionId,
  data: { account_id: accountId, votes_received: voteCount },
  isVotable = true,
  isSelected = false,
  onSelect,
}) => {
  const viewer = useWalletUserSession();

  const { isLoading, canReceiveVotes, hasUserVotes, handleVoteCast } = useVotingRoundCandidateEntry(
    { electionId, accountId },
  );

  const unableToVoteError = useMemo(() => {
    if (viewer.isSignedIn) {
      if (!canReceiveVotes) return "You cannot vote for this project.";
    } else return "Please sign in to vote.";
  }, [canReceiveVotes, viewer.isSignedIn]);

  const onCheckTriggered = useCallback(
    (checked: CheckedState) => onSelect?.(accountId, Boolean(checked)),
    [accountId, onSelect],
  );

  return (
    <AccountListItem
      highlightOnHover
      hideStatusOnDesktop
      classNames={{
        root: cn("px-4 rounded-lg", {
          "bg-neutral-50": isSelected,
          "bg-[#CEE9CF] hover:bg-[#CEE9CF]": hasUserVotes,
        }),
      }}
      statusElement={
        isLoading ? (
          <Skeleton className="h-5 w-11" />
        ) : (
          <div className="color-neutral-500 flex flex-nowrap items-center">
            <Dot className="hidden md:block" />
            <span className="prose text-sm font-medium leading-tight">{`${voteCount} Votes`}</span>
          </div>
        )
      }
      primarySlot={
        typeof onSelect === "function" ? (
          <div
            className={cn("pr-3.75 inline-flex h-16 items-center justify-start gap-4 py-4", {
              invisible: !canReceiveVotes,
            })}
          >
            <Checkbox
              disabled={!canReceiveVotes}
              checked={isSelected}
              onCheckedChange={onCheckTriggered}
            />
          </div>
        ) : null
      }
      secondarySlot={
        <div className="flex items-center">
          <div className="hidden h-16 w-24 items-center justify-end p-4 md:inline-flex">
            {isLoading ? (
              <Skeleton className="h-5 w-11" />
            ) : (
              <div className="prose text-right text-sm font-medium leading-tight">{voteCount}</div>
            )}
          </div>

          {isVotable && (
            <div className="inline-flex h-16 items-center justify-end p-4 pr-0">
              {isLoading ? (
                <Skeleton className="w-15.5 h-10" />
              ) : (
                <Button
                  variant="standard-outline"
                  disabled={!canReceiveVotes}
                  title={canReceiveVotes ? undefined : unableToVoteError}
                  onClick={handleVoteCast}
                  className="ml-auto h-fit"
                >
                  {"Vote"}
                </Button>
              )}
            </div>
          )}
        </div>
      }
      {...{ accountId }}
    />
  );
};
