import { ReactElement } from "react";

import { useRouteQuery } from "@/common/lib";
import { PotLayout } from "@/modules/pot";
import { PotEditor } from "@/modules/pot-editor";

const PotEditorSettingsTab = () => {
  const {
    query: { potId },
  } = useRouteQuery();

  return (
    <div className="flex w-full flex-col items-center">
      <PotEditor potId={typeof potId === "string" ? potId : "unknown"} />
    </div>
  );
};

PotEditorSettingsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default PotEditorSettingsTab;
