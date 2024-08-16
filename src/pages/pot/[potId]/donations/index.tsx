import { ReactElement } from "react";

import { PotLayout } from "@/modules/pot";

const DonationsTab = () => {
  return (
    <main className="flex flex-col">
      <p>Donations Page</p>
    </main>
  );
};

DonationsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default DonationsTab;
