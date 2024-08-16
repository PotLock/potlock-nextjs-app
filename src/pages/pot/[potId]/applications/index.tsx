import { ReactElement } from "react";

import { PotLayout } from "@/modules/pot";

const ApplicationsTab = () => {
  return (
    <main className="flex flex-col">
      <p>Applications Page</p>
    </main>
  );
};

ApplicationsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default ApplicationsTab;
