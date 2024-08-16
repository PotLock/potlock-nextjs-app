import { ReactElement } from "react";

import { PotLayout } from "@/modules/pot";

const DonationsSubPage = () => {
  return (
    <main className="flex flex-col">
      <p>Donations Page</p>
    </main>
  );
};

DonationsSubPage.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default DonationsSubPage;
