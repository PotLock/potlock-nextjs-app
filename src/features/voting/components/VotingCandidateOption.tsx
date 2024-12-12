import { useCallback } from "react";

import { CheckedState } from "@radix-ui/react-checkbox";

import { ByElectionId, Candidate } from "@/common/contracts/core/voting";
import { Button, Checkbox, Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { AccountOption } from "@/entities/account";

import { useVotingCandidateEntry } from "../hooks/candidates";

export type VotingCandidateOptionProps = ByElectionId & {
  data: Candidate;
  isSelected?: boolean;
  onSelect?: (accountId: string, isSelected: boolean) => void;
};

export const VotingCandidateOption: React.FC<VotingCandidateOptionProps> = ({
  electionId,
  data: { account_id: accountId, votes_received: votesCount },
  isSelected = false,
  onSelect,
}) => {
  const { isLoading, canReceiveVotes, hasUserVotes, handleVoteCast } = useVotingCandidateEntry({
    electionId,
    accountId,
  });

  const onCheckTriggered = useCallback(
    (checked: CheckedState) => onSelect?.(accountId, Boolean(checked)),
    [accountId, onSelect],
  );

  return (
    <AccountOption
      highlightOnHover
      classNames={{
        root: cn("px-4", {
          "bg-neutral-50": isSelected,
          "bg-conifer-50 hover:bg-conifer-50": hasUserVotes,
        }),
      }}
      primaryAction={
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
      secondaryAction={
        <div className="flex items-center">
          <div className="hidden h-16 w-24 items-center justify-end p-4 md:inline-flex">
            {isLoading ? (
              <Skeleton className="h-5 w-11" />
            ) : (
              <div className="prose text-right text-sm font-medium leading-tight">{votesCount}</div>
            )}
          </div>

          <div className="hidden h-16 items-center justify-end p-4 pr-0 md:inline-flex">
            {isLoading ? (
              <Skeleton className="w-15.5 h-10" />
            ) : (
              <Button
                variant="standard-outline"
                disabled={!canReceiveVotes}
                title={canReceiveVotes ? undefined : "You have already voted for this project"}
                onClick={handleVoteCast}
                className="ml-auto h-fit"
              >
                {"Vote"}
              </Button>
            )}
          </div>
        </div>
      }
      {...{ accountId }}
    />
  );
};
