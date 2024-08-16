import { ReactElement } from "react";

import { PotLayout } from "@/modules/pot";

const PayoutsTab = () => {
  return (
    <main className="flex flex-col">
      <p>Payouts Page</p>
    </main>
  );
};

PayoutsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default PayoutsTab;
