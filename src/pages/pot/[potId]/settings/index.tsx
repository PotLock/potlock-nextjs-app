import { ReactElement } from "react";

import { PotLayout } from "@/modules/pot";

const SettingsSubPage = () => {
  return (
    <main className="flex flex-col">
      <p>Settings Page</p>
    </main>
  );
};

SettingsSubPage.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default SettingsSubPage;
