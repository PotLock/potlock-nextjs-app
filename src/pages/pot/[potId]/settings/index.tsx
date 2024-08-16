import { ReactElement } from "react";

import { PotLayout } from "@/modules/pot";

const SettingsTab = () => {
  return (
    <main className="flex flex-col">
      <p>Settings Page</p>
    </main>
  );
};

SettingsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default SettingsTab;
