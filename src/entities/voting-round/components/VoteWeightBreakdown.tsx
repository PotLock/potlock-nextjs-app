import { useMemo } from "react";

import { X } from "lucide-react";
import { MdCheckCircleOutline, MdStar } from "react-icons/md";

import { ByPotId } from "@/common/api/indexer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Separator,
} from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";

import {
  useVotingRoundVoterVoteWeight,
  useVotingRoundVoterVoteWeightAmplifiers,
} from "../hooks/vote-weight";

export type VotingRoundVoteWeightBreakdownProps = ByPotId & {
  mode: "modal" | "panel";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
};

export const VotingRoundVoteWeightBreakdown: React.FC<VotingRoundVoteWeightBreakdownProps> = ({
  potId,
  open,
  onOpenChange,
  mode,
  className,
}) => {
  const isDialogOpen = useMemo(() => open && mode === "modal", [mode, open]);
  const { accountId } = useWalletUserSession();
  const { voteWeight } = useVotingRoundVoterVoteWeight({ accountId, potId });
  const voteWeightAmplifiers = useVotingRoundVoterVoteWeightAmplifiers({ accountId, potId });

  const checklist = useMemo(
    () => (
      <div className="pl-8">
        <div className="flex flex-col gap-3">
          <Separator className={cn("color-neutral-200", { hidden: mode === "modal" })} />

          {voteWeightAmplifiers.map(({ name, description, amplificationPercent, isApplicable }) => (
            <div
              key={name + amplificationPercent + isApplicable}
              title={description}
              className={cn("flex items-center justify-between text-sm", {
                "text-neutral-950": isApplicable,
                "text-neutral-500": !isApplicable,
              })}
            >
              <span className="prose">{name}</span>

              <div className="flex items-center gap-2">
                <span className="font-600">{`${amplificationPercent} %`}</span>

                <MdCheckCircleOutline
                  className={cn("h-6 w-6", {
                    "color-conifer-600": isApplicable,
                    "color-neutral-300": !isApplicable,
                  })}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    [mode, voteWeightAmplifiers],
  );

  return (
    <>
      <div
        className={cn(
          "w-100 flex flex-col gap-2 rounded-lg border bg-neutral-50 px-4 pb-5 pt-2",
          { hidden: mode !== "panel" || (mode === "panel" && !open) },
          className,
        )}
      >
        <div className="flex items-center py-2 text-lg font-semibold">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <MdStar className="color-corn-500 h-6 w-6" />
              <h2 className="min-w-[214px] text-lg font-semibold">{"Weight Boost"}</h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="prose text-nowrap font-semibold">{`${voteWeight.mul(100).toNumber()} %`}</span>

              <X
                onClick={() => onOpenChange(false)}
                className="h-6 w-6 cursor-pointer text-neutral-400"
              />
            </div>
          </div>
        </div>

        {checklist}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MdStar className="color-corn-500 h-6 w-6" />
              <h4 className="prose">{"Weight Boost"}</h4>
              <span className="font-semibold text-white">{`${voteWeight.mul(100).toNumber()} %`}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="p-6">{checklist}</div>
        </DialogContent>
      </Dialog>
    </>
  );
};
