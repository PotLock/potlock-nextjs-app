import { ReactElement } from "react";

import { PotLayout } from "@/modules/pot";

const ProjectsTab = () => {
  return (
    <main className="flex flex-col">
      <p>Projects Page</p>
    </main>
  );
};

ProjectsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default ProjectsTab;
