import {
  MdAppRegistration,
  MdCheckCircleOutline,
  MdNotAccessible,
  MdOutlineQuestionMark,
} from "react-icons/md";

import { BasicRequirement } from "@/common/types";

import { cn } from "../../utils";

export type ChecklistProps = {
  title: string;
  breakdown: BasicRequirement[];
  isFinalized?: boolean;
};

export const Checklist: React.FC<ChecklistProps> = ({ title, breakdown, isFinalized = true }) => (
  <div
    className={cn(
      "xl:w-126.5 min-w-87.5 lg:w-fit flex h-[232px] w-full flex-col items-start justify-start",
      "rounded-2xl bg-neutral-50 p-2",
    )}
  >
    <div className="inline-flex items-center justify-start gap-2 self-stretch py-2">
      <MdAppRegistration className="h-6 w-6" />

      <span
        className={cn(
          "shrink grow basis-0 text-[17px] font-semibold leading-normal text-[#292929]",
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
      {breakdown.map(({ title, isSatisfied }) => (
        <div className="inline-flex items-center justify-start gap-2 self-stretch" key={title}>
          {isSatisfied ? (
            <MdCheckCircleOutline className="color-success relative h-6 w-6" />
          ) : (
            <>
              {isFinalized ? (
                <MdNotAccessible className="color-destructive h-6 w-6" />
              ) : (
                <MdOutlineQuestionMark className="h-6 w-6" />
              )}
            </>
          )}

          <span className="text-sm font-normal leading-tight text-neutral-600">{title}</span>
        </div>
      ))}
    </div>
  </div>
);
