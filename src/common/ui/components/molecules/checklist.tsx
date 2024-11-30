import { CircleHelp, CircleX } from "lucide-react";
import { MdAppRegistration, MdCheckCircleOutline } from "react-icons/md";

import { BasicRequirement } from "@/common/types";

import { cn } from "../../utils";
import { Spinner } from "../atoms/spinner";

export type ChecklistProps = {
  title: string;
  requirements: BasicRequirement[];
  error?: Error;
};

export const Checklist: React.FC<ChecklistProps> = ({ title, requirements, error }) => (
  <div
    className={cn(
      "xl:w-126.5 min-w-87.5 lg:w-fit flex h-fit w-full flex-col items-start justify-start",
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

    {error ? (
      <span className="text-destructive text-xl">{error.message}</span>
    ) : (
      <ul
        className={cn(
          "flex h-fit flex-col items-start justify-start gap-4 self-stretch",
          "rounded-lg bg-white p-4 shadow",
        )}
      >
        {requirements.map(
          ({
            title,
            hasFulfillmentAssessmentInputs = true,
            isFulfillmentAssessmentPending = false,
            isSatisfied,
          }) => (
            <li className="inline-flex items-center justify-start gap-2 self-stretch" key={title}>
              {isFulfillmentAssessmentPending ? (
                <Spinner className="h-6 w-6" />
              ) : (
                <>
                  {isSatisfied ? (
                    <MdCheckCircleOutline className="color-success relative h-6 w-6" />
                  ) : (
                    <>
                      {hasFulfillmentAssessmentInputs ? (
                        <CircleX className="color-destructive h-6 w-6" />
                      ) : (
                        <CircleHelp className="color-peach-300 h-6 w-6" />
                      )}
                    </>
                  )}
                </>
              )}

              <span className="text-sm font-normal leading-tight text-neutral-600">{title}</span>
            </li>
          ),
        )}
      </ul>
    )}
  </div>
);
