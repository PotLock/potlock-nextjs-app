import { ReactElement } from "react";

import { PotLayout } from "@/modules/pot";

const ApplicationsSubPage = () => {
  return (
    <main className="flex flex-col">
      <p>Applications Page</p>
    </main>
  );
};

ApplicationsSubPage.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default ApplicationsSubPage;
