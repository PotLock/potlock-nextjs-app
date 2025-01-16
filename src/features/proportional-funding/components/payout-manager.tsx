import { useCallback } from "react";

import { MdCheck, MdFileDownload } from "react-icons/md";

import type { ByPotId } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { Button, Skeleton } from "@/common/ui/components";
import { useToast } from "@/common/ui/hooks";
import { useSession } from "@/entities/_shared/session";
import { useToken } from "@/entities/_shared/token";
import { usePotAuthorization } from "@/entities/pot";
import { VotingRoundResultsTable, useVotingRoundResults } from "@/entities/voting-round";

import { submitPayouts } from "../model/effects";

export type ProportionalFundingPayoutManagerProps = ByPotId & {
  onSubmitSuccess: VoidFunction;
};

export const ProportionalFundingPayoutManager: React.FC<ProportionalFundingPayoutManagerProps> = ({
  potId,
  onSubmitSuccess,
}) => {
  const { toast } = useToast();
  const authenticatedUser = useSession();
  const authorizedUser = usePotAuthorization({ potId, accountId: authenticatedUser.accountId });
  const votingRoundResults = useVotingRoundResults({ potId });

  const { isMetadataLoading: isTokenMetadataLoading, data: token } = useToken({
    tokenId: NATIVE_TOKEN_ID,
  });

  const handlePayoutsSubmit = useCallback(() => {
    if (votingRoundResults.data !== undefined && token !== undefined) {
      submitPayouts({
        potId,
        tokenDecimals: token.metadata.decimals,
        recipients: votingRoundResults.data.winners,
      })
        .then((_submittedPayouts) => {
          toast({
            title: "Payouts have been successfully submitted",
          });

          onSubmitSuccess();
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Failed to submit payouts",
            description: error.message,
          });

          console.error(error);
        });
    }
  }, [onSubmitSuccess, potId, toast, token, votingRoundResults.data]);

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

        {authorizedUser.canSubmitPayouts && (
          <>
            {votingRoundResults.isLoading || isTokenMetadataLoading ? (
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

        {authorizedUser.canInitiatePayoutProcessing && (
          <>
            {votingRoundResults.isLoading ? (
              <Skeleton className="w-45 h-10" />
            ) : (
              // TODO: WIP
              <Button>{"Initiate Payout Processing"}</Button>
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
