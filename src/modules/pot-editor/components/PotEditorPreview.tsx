import { ByPotId } from "@/common/api/potlock";

export type PotEditorPreviewProps = ByPotId & {};

export const PotEditorPreview: React.FC<PotEditorPreviewProps> = ({
  potId,
}) => {
  return (
    <div un-flex="~ col" un-gap="8">
      <div></div>

      <div un-flex="column" un-gap="4"></div>
    </div>
  );
};
