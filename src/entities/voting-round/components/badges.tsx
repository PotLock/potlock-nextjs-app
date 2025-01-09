import { Tooltip, TooltipContent, TooltipTrigger } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";

import type { VotingRoundVoteWeightAmplifier } from "../types";
import { voteWeightAmplificationCriteriaIcons } from "./icons";

export type VotingRoundVoteWeightBoostBadgeProps = { data: VotingRoundVoteWeightAmplifier };

export const VotingRoundVoteWeightBoostBadge: React.FC<VotingRoundVoteWeightBoostBadgeProps> = ({
  data: { isApplicable, name, description, criteria, amplificationPercent },
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div
        className={cn(
          "group inline-flex items-center gap-2 rounded-md border px-2 py-1 shadow-inner",

          {
            "border-[#f8d3b0] bg-[#fef6ee] text-[#b63d18]": isApplicable,
            "border-[#dadada] bg-[#f7f7f7] text-[#7b7b7b]": !isApplicable,
          },
        )}
      >
        {voteWeightAmplificationCriteriaIcons[criteria]}

        {isApplicable ? (
          <span className="inline-flex gap-2">
            <span className="text-sm font-normal text-inherit">{`+${amplificationPercent}%`}</span>

            {
              <span className="hidden text-sm font-normal text-inherit group-hover:block">
                {name}
              </span>
            }
          </span>
        ) : (
          <span className="text-sm font-normal text-inherit">{`+${amplificationPercent}%`}</span>
        )}
      </div>
    </TooltipTrigger>

    <TooltipContent className="w-64">{description}</TooltipContent>
  </Tooltip>
);
