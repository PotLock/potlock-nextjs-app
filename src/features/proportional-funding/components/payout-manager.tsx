import { useCallback } from "react";

import { MdCheck, MdFileDownload } from "react-icons/md";

import type { ByPotId } from "@/common/api/indexer";
import { Button, Skeleton } from "@/common/ui/components";
import { useToast } from "@/common/ui/hooks";
import { useSession } from "@/entities/_shared/session";
import { usePotAuthorization } from "@/entities/pot";
import { VotingRoundResultsTable, useVotingRoundResults } from "@/entities/voting-round";

import { submitPayouts } from "../model/effects";

export type ProportionalFundingPayoutManagerProps = ByPotId & {};

export const ProportionalFundingPayoutManager: React.FC<ProportionalFundingPayoutManagerProps> = ({
  potId,
}) => {
  const { toast } = useToast();
  const authenticatedUser = useSession();
  const authorizedUser = usePotAuthorization({ potId, accountId: authenticatedUser.accountId });
  const votingRoundResults = useVotingRoundResults({ potId });

  const handlePayoutsSubmit = useCallback(() => {
    if (votingRoundResults.data !== undefined) {
      submitPayouts({ potId, recipients: votingRoundResults.data.winners })
        .then((submittedPayouts) => {
          console.log(submittedPayouts);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [potId, votingRoundResults.data]);

  // TODO!: REMOVE BEFORE FINAL RELEASE!
  authorizedUser.isChefOrGreater = true;

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex w-full justify-end gap-6">
        {votingRoundResults.handleWinnersCsvDownload === undefined ? (
          <Skeleton className="w-45 h-10" />
        ) : (
          <Button variant="standard-outline" onClick={votingRoundResults.handleWinnersCsvDownload}>
            <MdFileDownload className="h-4.5 w-4.5" />

            <span className="font-500 hidden whitespace-nowrap text-sm md:inline-flex">
              {"Download CSV"}
            </span>
          </Button>
        )}

        {authorizedUser.isChefOrGreater && (
          <>
            {votingRoundResults.isLoading ? (
              <Skeleton className="w-45 h-10" />
            ) : (
              <Button variant="brand-filled" onClick={handlePayoutsSubmit}>
                <MdCheck className="h-4.5 w-4.5" />

                <span className="font-500 hidden whitespace-nowrap text-sm md:inline-flex">
                  {"Submit Payouts"}
                </span>
              </Button>
            )}
          </>
        )}
      </div>

      {votingRoundResults.isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <VotingRoundResultsTable {...{ potId }} />
      )}
    </div>
  );
};
