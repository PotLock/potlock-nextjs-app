import { MdAppRegistration, MdCheckCircleOutline } from "react-icons/md";

import { ByPotId } from "@/common/api/indexer";
import { cn } from "@/common/ui/utils";

import { POT_METAPOOL_APPLICATION_REQUIREMENTS } from "../constants";

export type PotApplicationRequirementsProps = ByPotId & {};

export const PotApplicationRequirements: React.FC<PotApplicationRequirementsProps> = ({
  potId,
}) => {
  return (
    <div
      className={cn(
        "xl:w-126.5 min-w-87.5 lg:w-fit flex h-[232px] w-full flex-col items-start justify-start",
        "rounded-2xl bg-[#f7f7f7] p-2",
      )}
    >
      <div className={cn("inline-flex items-center", "justify-start gap-2 self-stretch py-2")}>
        <MdAppRegistration className="h-6 w-6" />

        <div
          className={cn(
            "shrink grow basis-0",
            "text-[17px] font-semibold leading-normal text-[#292929]",
          )}
        >
          {"Application Requirements"}
        </div>
      </div>

      <div
        className={cn(
          "flex h-44 flex-col",
          "items-start justify-start gap-4 self-stretch",
          "rounded-lg bg-white p-4 shadow",
        )}
      >
        {POT_METAPOOL_APPLICATION_REQUIREMENTS.map((text) => (
          <div
            className={cn("inline-flex items-center justify-start gap-2 self-stretch")}
            key={text}
          >
            <MdCheckCircleOutline className="color-success relative h-6 w-6" />
            <span className="text-sm font-normal leading-tight text-neutral-600">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
