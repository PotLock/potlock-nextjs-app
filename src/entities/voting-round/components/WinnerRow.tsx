import { useCallback } from "react";

import { CheckedState } from "@radix-ui/react-checkbox";
import { Dot } from "lucide-react";

import { NATIVE_TOKEN_DECIMALS, NATIVE_TOKEN_ID } from "@/common/constants";
import { indivisibleUnitsToFloat } from "@/common/lib";
import {
  Checkbox,
  LabeledIcon,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { AccountListItem } from "@/entities/_shared/account";
import { TokenIcon, useToken } from "@/entities/_shared/token";

import type { VotingRoundWinner } from "../types";

export type VotingRoundWinnerRowProps = {
  data: VotingRoundWinner;
  rank: number;
  isSelected?: boolean;
  onSelect?: (accountId: string, isSelected: boolean) => void;
};

export const VotingRoundWinnerRow: React.FC<VotingRoundWinnerRowProps> = ({
  data: { accountId, votes, accumulatedWeight, estimatedPayoutAmount },
  rank,
  isSelected = false,
  onSelect,
}) => {
  const { data: token } = useToken({ tokenId: NATIVE_TOKEN_ID });

  const onCheckTriggered = useCallback(
    (checked: CheckedState) => onSelect?.(accountId, Boolean(checked)),
    [accountId, onSelect],
  );

  return (
    <AccountListItem
      hideStatusOnDesktop
      classNames={{
        root: cn("px-4 rounded-none", {
          "bg-neutral-50": isSelected,
        }),
      }}
      statusElement={
        <div className="color-neutral-500 flex flex-nowrap items-center">
          <Dot className="hidden md:block" />
          <span className="prose text-sm font-medium leading-tight">{`${votes.length} Votes`}</span>
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
          <div className="inline-flex h-16 items-center justify-end overflow-hidden px-4 py-2">
            <div className="w-24 max-w-24  text-end text-sm font-medium leading-tight">
              {votes.length}
            </div>
          </div>

          <div className="inline-flex h-16 items-center overflow-hidden px-4 py-2">
            <span className="max-w-30.5 w-30.5 font-600 text-end uppercase leading-none">
              {accumulatedWeight}
            </span>
          </div>

          <div className="inline-flex h-16 items-center overflow-hidden px-4 py-2 pr-0">
            <Tooltip>
              <TooltipTrigger>
                <LabeledIcon
                  positioning="icon-text"
                  caption={`~ ${indivisibleUnitsToFloat(
                    estimatedPayoutAmount,
                    NATIVE_TOKEN_DECIMALS,
                    2,
                  )}`}
                  classNames={{ root: "w-50 justify-end", caption: "font-600" }}
                >
                  {token && <TokenIcon size="xs" tokenId={token.tokenId} />}
                </LabeledIcon>
              </TooltipTrigger>

              <TooltipContent>
                <span className="font-600">
                  {`${indivisibleUnitsToFloat(
                    estimatedPayoutAmount,
                    NATIVE_TOKEN_DECIMALS,
                    NATIVE_TOKEN_DECIMALS,
                  )}

                  ${token?.metadata.symbol ?? "..."}`}
                </span>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      }
      {...{ accountId }}
    />
  );
};
