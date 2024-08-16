import { ReactElement } from "react";

import { PotLayout } from "@/modules/pot";

const ProjectsSubPage = () => {
  return (
    <main className="flex flex-col">
      <p>Projects Page</p>
    </main>
  );
};

ProjectsSubPage.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default ProjectsSubPage;
