import { ReactElement, useEffect, useState } from "react";

import { PotLayout } from "@/modules/pot";
import { useRouter } from "next/router";
import * as potServices from "@/common/contracts/potlock/pot";
import { Application } from "@/common/contracts/potlock/interfaces/pot.interfaces";
// import { usePotApplications } from "@/common/api/potlock/hooks";

const ProjectsTab = () => {
  const router = useRouter();
  const query = router.query as { potId: string };

  // NOTE: not working
  // const potProjectsData = usePotApplications(query.potId);
  const [potProjects, setPotProjects] = useState<Application[]>([]);

  useEffect(() => {
    if (query.potId) {
      (async () => {
        const _projects = await potServices.getApplications({
          potId: query.potId,
        });

        // Set only the approved ones
        // TODO: Uncomment
        // setPotProjects(_projects.filter(application => application.status === "Approved"));
        setPotProjects(_projects);
      })();
    }
  }, [query.potId]);

  console.log(potProjects);

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
