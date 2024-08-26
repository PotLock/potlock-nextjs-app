import { ReactElement } from "react";

import { useRouter } from "next/router";

import { DonationsTable, PotLayout } from "@/modules/pot";

const DonationsTab = () => {
  const router = useRouter();
  const { potId } = router.query as {
    potId: string;
  };

  return (
    // Container
    <div className="md:py-12 flex w-full flex-col py-10">
      <DonationsTable potId={potId} />
    </div>
  );
};

DonationsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default DonationsTab;
