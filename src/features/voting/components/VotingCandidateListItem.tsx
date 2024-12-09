import { useCallback, useMemo } from "react";

import { CheckedState } from "@radix-ui/react-checkbox";

import { ByPotId, indexer } from "@/common/api/indexer";
import { Candidate, votingClient } from "@/common/contracts/core/voting";
import { Button, Checkbox } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { AccountProfilePicture } from "@/entities/account";
import { useSessionAuth } from "@/entities/session";

import { useVotingCandidateVotes } from "../hooks/candidates";

export type VotingCandidateListItemProps = ByPotId & {
  data: Candidate;
  isSelected?: boolean;
  onSelect?: (accountId: string, isSelected: boolean) => void;
};

export const VotingCandidateListItem: React.FC<VotingCandidateListItemProps> = ({
  potId,
  data: { account_id: accountId, votes_received: votesCount },
  isSelected = false,
  onSelect,
}) => {
  const userSession = useSessionAuth();
  const { data: account } = indexer.useAccount({ accountId });
  const { data: votes, mutate } = useVotingCandidateVotes({ potId, accountId });

  // TODO: Implement voting
  const canReceiveVotes = useMemo(
    () => votes?.find(({ voter }) => voter === userSession.accountId) === undefined,
    [votes, userSession.accountId],
  );

  const onCheckTriggered = useCallback(
    (checked: CheckedState) => onSelect?.(accountId, Boolean(checked)),
    [accountId, onSelect],
  );

  // TODO: Election ID is hardcoded
  const handleVoteCast = useCallback(() => {
    votingClient.vote({ election_id: 1, vote: [accountId, 1] }).then(() => mutate());
  }, [accountId, mutate]);

  return (
    <div className="flex items-center gap-4 rounded-none px-4 py-2 hover:bg-neutral-50">
      {typeof onSelect === "function" && (
        <Checkbox checked={isSelected} onCheckedChange={onCheckTriggered} />
      )}

      <AccountProfilePicture className="h-10 w-10" {...{ accountId }} />

      <div className="min-w-0 flex-1">
        {account ? (
          <div className="truncate font-medium">
            {account.near_social_profile_data?.name ?? account.id}
          </div>
        ) : null}

        <div className={cn("text-sm text-gray-500 md:hidden")}>{`${votesCount} Votes`}</div>
      </div>

      <div className="hidden h-16 w-24 items-center justify-end gap-3 p-4 md:inline-flex">
        <div className="text-right text-sm font-medium leading-tight text-zinc-800">
          {votesCount}
        </div>
      </div>

      <Button
        variant="standard-outline"
        disabled={!canReceiveVotes}
        title={canReceiveVotes ? undefined : "You have already voted for this project"}
        onClick={handleVoteCast}
        className="ml-auto"
      >
        {"Vote"}
      </Button>
    </div>
  );
};
