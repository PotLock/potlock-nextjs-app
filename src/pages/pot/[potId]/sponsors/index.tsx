import { ReactElement } from "react";

import { PotLayout } from "@/modules/pot";

const SponsorsTab = () => {
  return (
    <main className="flex flex-col">
      <p>Sponsors Page</p>
    </main>
  );
};

SponsorsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default SponsorsTab;
