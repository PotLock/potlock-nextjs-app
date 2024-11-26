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
        "flex h-44 flex-col",
        "items-start justify-start gap-4 self-stretch",
        "rounded-lg bg-white p-4 shadow",
      )}
    >
      {POT_METAPOOL_APPLICATION_REQUIREMENTS.map((text) => (
        <div className={cn("inline-flex items-center justify-start gap-2 self-stretch")} key={text}>
          <div className="relative h-6 w-6" />

          <div
            className={cn(
              "shrink grow basis-0",
              "text-sm font-normal leading-tight text-neutral-600",
            )}
          >
            {text}
          </div>
        </div>
      ))}
    </div>
  );
};
