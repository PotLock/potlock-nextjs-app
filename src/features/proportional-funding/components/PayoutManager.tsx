import { MdFileDownload, MdList } from "react-icons/md";

import type { ByPotId } from "@/common/api/indexer";
import { Button, Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { VotingRoundResultsTable, useVotingRoundResults } from "@/entities/voting-round";

export type ProportionalFundingPayoutManagerProps = ByPotId & {};

export const ProportionalFundingPayoutManager: React.FC<ProportionalFundingPayoutManagerProps> = ({
  potId,
}) => {
  const votingRoundResults = useVotingRoundResults({ potId });

  return (
    <div className="flex w-full flex-col">
      <div
        className={cn(
          "flex w-full items-center justify-between bg-[#fce9d5] p-4 text-[17px]",
          "md:rounded-tl-lg md:rounded-tr-lg",
        )}
      >
        <div className="flex items-center gap-2">
          <MdList className="color-peach-400 h-6 w-6" />
        </div>

        <div className="flex gap-2">
          {votingRoundResults.handleWinnersCsvDownload === undefined ? (
            <Skeleton className="w-45 h-10" />
          ) : (
            <Button
              variant="standard-outline"
              onClick={votingRoundResults.handleWinnersCsvDownload}
            >
              <MdFileDownload className="h-4.5 w-4.5" />

              <span className="font-500 hidden whitespace-nowrap text-sm md:inline-flex">
                {"Download in CSV"}
              </span>
            </Button>
          )}
        </div>
      </div>

      {votingRoundResults.data === undefined && votingRoundResults.isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <VotingRoundResultsTable {...{ potId }} />
      )}
    </div>
  );
};
