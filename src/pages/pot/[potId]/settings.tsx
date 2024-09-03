import { ReactElement } from "react";

import { useRouteQuery } from "@/common/lib";
import { PotLayout } from "@/modules/pot";
import { PotEditor } from "@/modules/pot-editor";

const PotSettingsTab = () => {
  const {
    query: { potId: potIdParam },
  } = useRouteQuery();

  const potId = typeof potIdParam === "string" ? potIdParam : undefined;

  console.log(potId);

  return (
    <div className="flex flex-col">
      <PotEditor {...{ potId }} />
    </div>
  );
};

PotSettingsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default PotSettingsTab;
