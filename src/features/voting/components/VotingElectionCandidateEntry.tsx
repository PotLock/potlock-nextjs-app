import { useCallback, useMemo } from "react";

import { CheckedState } from "@radix-ui/react-checkbox";

import { indexer } from "@/common/api/indexer";
import { Candidate, Vote } from "@/common/contracts/core/voting";
import { Button, Checkbox } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { AccountProfilePicture } from "@/entities/account";
import { useSessionAuth } from "@/entities/session";

export type VotingElectionCandidateEntryProps = Candidate & {
  electionVotes: Vote[];
  isSelected?: boolean;
  onSelect?: (accountId: string, isSelected: boolean) => void;
};

export const VotingElectionCandidateEntry: React.FC<VotingElectionCandidateEntryProps> = ({
  electionVotes,
  account_id: accountId,
  votes_received: votesCount,
  isSelected = false,
  onSelect,
}) => {
  const userSession = useSessionAuth();
  const { data: account } = indexer.useAccount({ accountId });

  const receivedVotes = useMemo(
    () => electionVotes.filter(({ candidate_id }) => candidate_id === accountId),
    [accountId, electionVotes],
  );

  const canReceiveVotes = useMemo(
    () => receivedVotes.find(({ voter }) => voter === userSession.accountId) === undefined,
    [receivedVotes, userSession.accountId],
  );

  const onCheckboxTriggered = useCallback(
    (checked: CheckedState) => onSelect?.(accountId, Boolean(checked)),
    [accountId, onSelect],
  );

  return (
    <div className={cn("flex items-center gap-4 rounded-lg", "py-4 hover:bg-gray-50", "md:p-4")}>
      {typeof onSelect === "function" && (
        <Checkbox checked={isSelected} onCheckedChange={onCheckboxTriggered} />
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

      <div className={cn("hidden text-right md:block")}>{votesCount}</div>

      <Button variant="standard-outline" disabled={!canReceiveVotes} className="ml-auto w-20">
        {canReceiveVotes ? "Vote" : "Voted"}
      </Button>
    </div>
  );
};
