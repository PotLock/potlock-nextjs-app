import { useCallback, useMemo } from "react";

import { CheckedState } from "@radix-ui/react-checkbox";

import {
  ByElectionId,
  Candidate,
  votingClient,
  votingClientHooks,
} from "@/common/contracts/core/voting";
import { Button, Checkbox } from "@/common/ui/components";
import { useToast } from "@/common/ui/hooks";
import { AccountOption } from "@/entities/account";
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
  const userSession = useSessionAuth();
  const { toast } = useToast();

  const { data: election } = votingClientHooks.useElection({
    electionId,
  });

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
    <AccountOption
      highlightOnHover
      classNames={{ root: "px-4" }}
      primaryAction={
        typeof onSelect === "function" ? (
          <Checkbox checked={isSelected} onCheckedChange={onCheckTriggered} />
        ) : null
      }
      secondaryAction={
        <div className="flex items-center">
          <div className="hidden h-16 w-24 items-center justify-end p-4 md:inline-flex">
            <div className="prose text-right text-sm font-medium leading-tight">{votesCount}</div>
          </div>

          <div className="hidden h-16 items-center justify-end p-4 pr-0 md:inline-flex">
            <Button
              variant="standard-outline"
              disabled={!canReceiveVotes}
              title={canReceiveVotes ? undefined : "You have already voted for this project"}
              onClick={handleVoteCast}
              className="ml-auto h-fit"
            >
              {"Vote"}
            </Button>
          </div>
        </div>
      }
      {...{ accountId }}
    />
  );
};
