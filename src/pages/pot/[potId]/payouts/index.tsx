import { ReactElement } from "react";

import { PotLayout } from "@/modules/pot";

const PayoutsSubPage = () => {
  return (
    <main className="flex flex-col">
      <p>Payouts Page</p>
    </main>
  );
};

PayoutsSubPage.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default PayoutsSubPage;
