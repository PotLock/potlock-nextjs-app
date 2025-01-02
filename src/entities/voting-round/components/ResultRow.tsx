import { useCallback } from "react";

import { CheckedState } from "@radix-ui/react-checkbox";
import { Dot } from "lucide-react";

import { Checkbox } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { AccountListItem } from "@/entities/_shared/account";
import { useSession } from "@/entities/_shared/session";

import type { VotingRoundWinner } from "../types";

export type VotingRoundResultRowProps = {
  data: VotingRoundWinner;
  rank: number;
  isSelected?: boolean;
  onSelect?: (accountId: string, isSelected: boolean) => void;
};

export const VotingRoundResultRow: React.FC<VotingRoundResultRowProps> = ({
  data: { accountId, voteCount, accumulatedWeight, estimatedPayoutAmount },
  rank,
  isSelected = false,
  onSelect,
}) => {
  const user = useSession();

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
        }),
      }}
      statusElement={
        <div className="color-neutral-500 flex flex-nowrap items-center">
          <Dot className="hidden md:block" />
          <span className="prose text-sm font-medium leading-tight">{`${voteCount} Votes`}</span>
        </div>
      }
      primarySlot={
        <div className="flex">
          <div className="inline-flex h-10 items-center justify-start gap-2 px-4 py-2 pl-0">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center",
                "rounded-full border border-neutral-200",
              )}
            >
              <span className="text-right text-xs font-medium leading-none">{rank}</span>
            </div>
          </div>

          {typeof onSelect === "function" ? (
            <div className={cn("pr-3.75 inline-flex h-16 items-center justify-start gap-4 py-4")}>
              <Checkbox checked={isSelected} onCheckedChange={onCheckTriggered} />
            </div>
          ) : null}
        </div>
      }
      secondarySlot={
        <div className="hidden items-center md:flex">
          <div className="inline-flex h-16 w-24 max-w-24 items-center justify-end p-4">
            <div className="prose text-right text-sm font-medium leading-tight">{voteCount}</div>
          </div>

          <div className="max-w-30.5 w-30.5 inline-flex h-16 items-center justify-end px-4 py-2">
            <span className="font-600 text-right uppercase leading-none">{accumulatedWeight}</span>
          </div>

          <div
            className={cn(
              "max-w-32.5 w-32.5 inline-flex h-16 items-center justify-end",
              "overflow-hidden px-4 py-2 pr-0",
            )}
          >
            <span className="font-600 w-full overflow-x-hidden text-center uppercase leading-none">
              {estimatedPayoutAmount}
            </span>
          </div>
        </div>
      }
      {...{ accountId }}
    />
  );
};
