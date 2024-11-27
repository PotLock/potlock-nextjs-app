import {
  MdAppRegistration,
  MdCheckCircleOutline,
  MdNotAccessible,
  MdOutlineQuestionMark,
} from "react-icons/md";

import { ByPotId } from "@/common/api/indexer";
import { cn } from "@/common/ui/utils";
import { useWallet } from "@/modules/auth";

import {
  ClearanceRequirementStatus,
  usePotApplicationUserClearance,
  usePotVotingUserClearance,
} from "../hooks/clearance";

export type RequirementsListProps = {
  title: string;
  breakdown: ClearanceRequirementStatus[];
};

export const RequirementsList: React.FC<RequirementsListProps> = ({ title, breakdown }) => {
  const { wallet } = useWallet();
  const { accountId = null } = wallet ?? {};

  return (
    <div
      className={cn(
        "xl:w-126.5 min-w-87.5 lg:w-fit flex h-[232px] w-full flex-col items-start justify-start",
        "rounded-2xl bg-neutral-50 p-2",
      )}
    >
      <div className={cn("inline-flex items-center", "justify-start gap-2 self-stretch py-2")}>
        <MdAppRegistration className="h-6 w-6" />

        <span
          className={cn(
            "shrink grow basis-0",
            "text-[17px] font-semibold leading-normal text-[#292929]",
          )}
        >
          {title}
        </span>
      </div>

      <div
        className={cn(
          "flex h-44 flex-col items-start justify-start gap-4 self-stretch",
          "rounded-lg bg-white p-4 shadow",
        )}
      >
        {breakdown.map(({ title, isSatisfied }) => {
          return (
            <div
              className={cn("inline-flex items-center justify-start gap-2 self-stretch")}
              key={title}
            >
              {isSatisfied ? (
                <MdCheckCircleOutline className="color-success relative h-6 w-6" />
              ) : (
                <>
                  {accountId === null ? (
                    <MdOutlineQuestionMark className="h-6 w-6" />
                  ) : (
                    <MdNotAccessible className="color-destructive h-6 w-6" />
                  )}
                </>
              )}
              <span className="text-sm font-normal leading-tight text-neutral-600">{title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export type PotVotingRequirementsProps = ByPotId & {};

export const PotVotingRequirements: React.FC<PotVotingRequirementsProps> = ({ potId: _ }) => {
  return <RequirementsList title="Voting Requirements" breakdown={usePotVotingUserClearance()} />;
};
