import { ReactElement } from "react";

import { PotLayout } from "@/modules/pot";

const SponsorsSubPage = () => {
  return (
    <main className="flex flex-col">
      <p>Sponsors Page</p>
    </main>
  );
};

SponsorsSubPage.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default SponsorsSubPage;
