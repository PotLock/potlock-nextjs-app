import { useCallback, useMemo } from "react";

import { CheckedState } from "@radix-ui/react-checkbox";

import { indexer } from "@/common/api/indexer";
import {
  ByElectionId,
  Candidate,
  votingClient,
  votingClientHooks,
} from "@/common/contracts/core/voting";
import { Button, Checkbox } from "@/common/ui/components";
import { useToast } from "@/common/ui/hooks";
import { cn } from "@/common/ui/utils";
import { AccountProfilePicture } from "@/entities/account";
import { useSessionAuth } from "@/entities/session";

export type VotingCandidateListItemProps = ByElectionId & {
  data: Candidate;
  isSelected?: boolean;
  onSelect?: (accountId: string, isSelected: boolean) => void;
};

export const VotingCandidateListItem: React.FC<VotingCandidateListItemProps> = ({
  electionId,
  data: { account_id: accountId, votes_received: votesCount },
  isSelected = false,
  onSelect,
}) => {
  const { toast } = useToast();
  const userSession = useSessionAuth();
  const { data: account } = indexer.useAccount({ accountId });
  const { data: election } = votingClientHooks.useElection({ electionId });

  const { data: votes, mutate: revalidateVotes } = votingClientHooks.useElectionCandidateVotes({
    electionId,
    accountId,
  });

  const canReceiveVotes = useMemo(
    () =>
      election && // election?.status === ElectionStatus.VotingPeriod &&
      votes?.find(({ voter: voterAccountId }) => voterAccountId === userSession.accountId) ===
        undefined,

    [election, votes, userSession.accountId],
  );

  const handleVoteCast = useCallback(
    () =>
      votingClient
        .vote({ election_id: electionId, vote: [accountId, 1] })
        .then((success) => {
          if (success) {
            revalidateVotes();

            toast({
              title: "Success!",
              description: "Your vote has been recorded successfully.",
            });
          }
        })
        .catch((error) => {
          console.error(error);

          toast({
            variant: "destructive",
            title: "Something went wrong.",
            description: "An error occurred while casting your vote.",
          });
        }),

    [accountId, electionId, revalidateVotes, toast],
  );

  const onCheckTriggered = useCallback(
    (checked: CheckedState) => onSelect?.(accountId, Boolean(checked)),
    [accountId, onSelect],
  );

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
