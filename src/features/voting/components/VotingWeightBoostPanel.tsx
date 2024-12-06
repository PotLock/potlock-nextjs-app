import { useMemo } from "react";

import { X } from "lucide-react";
import { MdCheckCircleOutline, MdStar } from "react-icons/md";

import { ByPotId } from "@/common/api/indexer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { useSessionAuth } from "@/entities/session";

import {
  useVotingParticipantVoteWeight,
  useVotingParticipantVoteWeightAmplifiers,
} from "../hooks/vote-weight";

export type VotingWeightBoostPanelProps = ByPotId & {
  mode?: "modal" | "panel";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
};

export const VotingWeightBoostPanel: React.FC<VotingWeightBoostPanelProps> = ({
  potId,
  open,
  onOpenChange,
  className,
  mode = "modal",
}) => {
  const { accountId } = useSessionAuth();
  const { voteWeight } = useVotingParticipantVoteWeight({ accountId, potId });

  const { voteWeightAmplifiers } = useVotingParticipantVoteWeightAmplifiers({ accountId, potId });

  const breakdown = useMemo(
    () => (
      <div className="space-y-4">
        <div className="space-y-4">
          {voteWeightAmplifiers.map(({ name, description, amplificationPercent, isApplicable }) => (
            <div
              key={name + amplificationPercent + isApplicable}
              title={description}
              className={"flex items-center justify-between text-sm"}
            >
              <span className="prose">{name}</span>

              <div className="flex items-center gap-2 font-bold">
                <span className="font-600">{`${amplificationPercent} %`}</span>

                {isApplicable ? (
                  <MdCheckCircleOutline className="color-conifer-600 h-6 w-6" />
                ) : (
                  <MdCheckCircleOutline className="color-neutral-300 h-6 w-6" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    [voteWeightAmplifiers],
  );

  return mode === "panel" ? (
    <div className={cn("rounded-lg border bg-neutral-50 px-4 pb-5 pt-3", className)}>
      <div className="mb-4 flex items-center gap-2 border-b py-2 text-lg font-semibold">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <MdStar className="color-corn-500 h-6 w-6" />
            <h2 className="min-w-[214px] text-lg font-semibold">{"Weight Boost"}</h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="prose text-nowrap font-semibold">{`${voteWeight.mul(100).toNumber()} %`}</span>

            <X
              onClick={() => onOpenChange(true)}
              className="h-6 w-6 cursor-pointer text-neutral-400"
            />
          </div>
        </div>
      </div>

      {breakdown}
    </div>
  ) : (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MdStar className="color-corn-500 h-6 w-6" />
            <h4 className="prose">{"Weight Boost"}</h4>
            <span className="font-semibold text-white">{`${voteWeight.mul(100).toNumber()} %`}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">{breakdown}</div>
      </DialogContent>
    </Dialog>
  );
};
