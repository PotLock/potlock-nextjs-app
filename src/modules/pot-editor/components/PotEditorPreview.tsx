import { Pencil } from "lucide-react";

import { ByPotId, potlock } from "@/common/api/potlock";
import { Button, Skeleton } from "@/common/ui/components";

type PotEditorPreviewSectionProps = {
  heading: string;
  children?: React.ReactNode;
};

const PotEditorPreviewSection: React.FC<PotEditorPreviewSectionProps> = ({
  heading,
  children,
}) => (
  <div un-flex="~" un-justify="between" un-items="center" un-gap="8">
    <span className="prose text-neutral-950">{heading}</span>

    {children ? (
      <span className="prose text-neutral-950">{children}</span>
    ) : (
      <Skeleton className="w-102 h-5" />
    )}
  </div>
);

export type PotEditorPreviewProps = ByPotId & { onEditClick: () => void };

export const PotEditorPreview: React.FC<PotEditorPreviewProps> = ({
  potId,
  onEditClick,
}) => {
  const { isLoading, data } = potlock.usePot({ potId });

  return (
    <div un-flex="~ col" un-gap="8">
      <div un-flex="~" un-gap="8">
        <div un-pr="4" un-flex="~ col" un-gap="2">
          <span className="prose font-500 text-sm text-neutral-500">
            {"Owner"}
          </span>
        </div>

        <div un-flex="~" un-justify="between">
          <Button type="button" onClick={onEditClick} variant="brand-plain">
            <Pencil width={14} height={14} />

            <span className="prose line-height-none font-500">
              {"Edit Pot Settings"}
            </span>
          </Button>
        </div>
      </div>

      <div un-flex="~ column" un-gap="4"></div>
    </div>
  );
};
