import { ReactElement } from "react";

import { PotEditor, PotLayout } from "@/modules/pot";

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
