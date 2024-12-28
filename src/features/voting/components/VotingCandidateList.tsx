import { useCallback, useMemo } from "react";

import { useSet, useWindowSize } from "@uidotdev/usehooks";
import { MdIndeterminateCheckBox } from "react-icons/md";

import { ByElectionId, Candidate, votingClient, votingHooks } from "@/common/contracts/core/voting";
import { AccountId } from "@/common/types";
import { Button, ScrollArea } from "@/common/ui/components";
import { useToast } from "@/common/ui/hooks";
import { cn } from "@/common/ui/utils";
import { useSession } from "@/entities/_shared/session";

import { VotingCandidateOption } from "./VotingCandidateOption";

export type VotingCandidateListProps = ByElectionId & {
  data: Candidate[];
  onBulkVoteSuccess: () => void;
};

//? TODO: Use VirtualScroll for better performance
export const VotingCandidateList: React.FC<VotingCandidateListProps> = ({
  electionId,
  data,
  onBulkVoteSuccess,
}) => {
  const { height: windowHeight } = useWindowSize();
  const { toast } = useToast();
  const authenticatedUser = useSession();
  const selectedEntries = useSet<AccountId>();

  const { isLoading: _isRemainingUserVotingCapacityLoading, data: remainingUserVotingCapacity } =
    votingHooks.useVoterRemainingCapacity({
      enabled: electionId !== 0 && authenticatedUser.accountId !== undefined,
      electionId,
      accountId: authenticatedUser.accountId ?? "noop",
    });

  const handleEntrySelect = useCallback(
    (accountId: AccountId, isSelected: boolean): void =>
      void (isSelected ? selectedEntries.add(accountId) : selectedEntries.delete(accountId)),

    [selectedEntries],
  );

  const canCastBulkVote = useMemo(
    () => selectedEntries.size <= (remainingUserVotingCapacity ?? 0),
    [remainingUserVotingCapacity, selectedEntries],
  );

  const handleBulkVote = useCallback(
    () =>
      votingClient
        .voteBatch({
          election_id: electionId,
          votes: Array.from(selectedEntries.values()).map((accountId) => [accountId, 1]),
        })
        .then((outcome) => {
          console.log(outcome);

          if (outcome) {
            onBulkVoteSuccess();
            selectedEntries.clear();

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

    [electionId, onBulkVoteSuccess, selectedEntries, toast],
  );

  return (
    <>
      <div className="flex justify-between bg-neutral-50 text-xs text-neutral-500">
        <div className="inline-flex h-10 w-12 px-4 py-2" />

        <div className="mr-a inline-flex h-10 items-center justify-start gap-2 px-4 py-2">
          <span className="font-600 shrink grow basis-0 uppercase leading-none">{"Projects"}</span>
        </div>

        <div className="hidden md:flex">
          <div className="flex h-10 w-24 items-center px-4 py-2">
            <span className="font-600 shrink grow basis-0 text-right uppercase leading-none">
              {"Votes"}
            </span>
          </div>

          <div className="flex h-10 w-24 items-center px-4 py-2">
            <span className="font-600 shrink grow basis-0 text-center uppercase leading-none">
              {"Actions"}
            </span>
          </div>
        </div>
      </div>

      <ScrollArea style={{ height: (windowHeight ?? 820) - 320 }}>
        <div className="flex flex-col gap-2 pb-8 pt-2">
          {data.map((candidate) => (
            <VotingCandidateOption
              key={candidate.account_id}
              data={candidate}
              isSelected={selectedEntries.has(candidate.account_id)}
              onSelect={handleEntrySelect}
              {...{ electionId }}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Floating Action Bar */}
      <div
        className={cn(
          "rounded-4 fixed bottom-4 left-1/2 flex -translate-x-1/2 border md:bottom-8",
          "bg-background flex items-center gap-4 p-4 shadow-lg",
          { hidden: selectedEntries.size === 0 },
        )}
      >
        <div className="flex items-center gap-2">
          <MdIndeterminateCheckBox
            title="Reset selection"
            onClick={selectedEntries.clear}
            className="w-4.5 h-4.5 color-primary-400 cursor-pointer"
          />
          <span>{`${selectedEntries.size} Selected Projects`}</span>
        </div>

        <Button
          variant="standard-filled"
          disabled={!canCastBulkVote}
          title={
            canCastBulkVote
              ? undefined
              : `You have exceeded your remaining voting capacity of ${remainingUserVotingCapacity}.`
          }
          onClick={handleBulkVote}
        >
          {"Vote All"}
        </Button>
      </div>
    </>
  );
};
