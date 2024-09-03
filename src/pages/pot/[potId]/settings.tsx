import { ReactElement } from "react";

import { PotLayout } from "@/modules/pot";
import { PotEditor } from "@/modules/pot-editor";

const PotSettingsTab = () => {
  return (
    <div className="flex flex-col">
      <PotEditor />
    </div>
  );
};

PotSettingsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default PotSettingsTab;
