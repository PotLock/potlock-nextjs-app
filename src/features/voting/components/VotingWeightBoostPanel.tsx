import { useMemo } from "react";

import { X } from "lucide-react";

import { ByPotId } from "@/common/api/indexer";
import CheckCircle from "@/common/assets/svgs/CheckCircle";
import Star from "@/common/assets/svgs/Star";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";

import { useVotingAuthenticatedParticipantVoteWeight } from "../hooks/vote-weight";

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
  const { voteWeight, voteWeightAmplificationRules } = useVotingAuthenticatedParticipantVoteWeight({
    potId,
  });

  const breakdown = useMemo(
    () => (
      <div className="space-y-4">
        <div className="space-y-4">
          {voteWeightAmplificationRules.map(({ name, description, amplificationPercent }) => (
            <div className="flex items-center justify-between text-black" key={name + description}>
              <span className="prose">{name}</span>

              <div className="flex items-center gap-2">
                <span>{`${amplificationPercent} %`}</span>
                <CheckCircle className="h-6 w-6" color="#629D13" />

                {/** TODO: provide `isSatisfied` and display the variant below if it's `false` */}
                {/** <CheckCircle className="h-6 w-6" color="#C7C7C7" /> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    [voteWeightAmplificationRules],
  );

  return mode === "panel" ? (
    <div className={cn("rounded-lg border bg-[#f7f7f7] px-4 pb-5 pt-3", className)}>
      <div className="mb-4 flex items-center gap-2 border-b py-2 text-lg font-semibold">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <Star className="h-6 w-6" />
            <h2 className="min-w-[214px] text-lg font-semibold">{"Weight Boost"}</h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="prose text-nowrap font-semibold">{`${voteWeight.mul(100).toNumber()} %`}</span>

            <X
              onClick={() => onOpenChange(true)}
              className="h-6 w-6 cursor-pointer text-[#A6A6A6]"
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
            <Star className="h-6 w-6" />
            <h4 className="prose">{"Weight Boost"}</h4>
            <span className="font-semibold text-white">{`${voteWeight.mul(100).toNumber()} %`}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">{breakdown}</div>
      </DialogContent>
    </Dialog>
  );
};
