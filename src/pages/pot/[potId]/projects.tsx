import { ReactElement, useEffect, useState } from "react";

import { useRouter } from "next/router";

import { Application } from "@/common/contracts/core/interfaces/pot.interfaces";
import * as potContract from "@/common/contracts/core/pot";
import { InfiniteScroll, SearchBar } from "@/common/ui/components";
import { PotLayout } from "@/modules/pot";
import { Profile } from "@/modules/profile/models";
import { ProjectCard } from "@/modules/project";
import { useTypedSelector } from "@/store";
// import { usePotApplications } from "@/common/api/potlock/hooks";

const MAXIMUM_CARDS_PER_INDEX = 9;

const ProjectsTab = () => {
  const router = useRouter();
  const query = router.query as { potId: string };

  // NOTE: not working
  // const potProjectsData = usePotApplications(query.potId);
  const [potProjects, setPotProjects] = useState<Application[]>([]);
  const [filteredPotProjects, setFilteredPotProjects] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const registrationsProfile = useTypedSelector((state) => state.profiles);
  const [index, setIndex] = useState(1);

  useEffect(() => {
    if (query.potId) {
      (async () => {
        const _projects = await potContract.getApplications({
          potId: query.potId,
        });

        // Set only the approved ones
        const approvedProjects = _projects.filter(
          (application) => application.status === "Approved",
        );
        setPotProjects(approvedProjects);
        setFilteredPotProjects(approvedProjects);
      })();
    }
  }, [query.potId]);

  // Handle Search
  useEffect(() => {
    const handleSearch = (application: Application, profile: Profile) => {
      if (search === "") return true;
      const { project_id: projectId } = application;
      const { socialData, tags, team } = profile || {};
      // registration fields to search in
      const fields = [
        projectId,
        socialData?.description,
        socialData?.name,
        tags?.join(" "),
        team?.join(" "),
      ];

      return fields.some((item) => (item || "").toLowerCase().includes(search));
    };

    if (search) {
      const filteredApplicationProjects = potProjects.filter((applicationProject) => {
        const profile = registrationsProfile[applicationProject.project_id] || {};

        return handleSearch(applicationProject, profile);
      });

      setFilteredPotProjects(filteredApplicationProjects);
    }
  }, [search, potProjects, registrationsProfile]);

  return (
    <div className="md:py-12 flex w-full flex-col py-10">
      <div className="flex w-full flex-col gap-5">
        <div className="font-600 text-[18px] text-[#292929]">
          All Projects
          <span className="ml-4">{potProjects.length}</span>
        </div>
        <div className="flex w-full items-center gap-4">
          <SearchBar
            placeholder="Search projects"
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
        </div>
      </div>
      {filteredPotProjects.length ? (
        <InfiniteScroll
          className="p-0.5"
          items={filteredPotProjects}
          index={index}
          setIndex={setIndex}
          size={MAXIMUM_CARDS_PER_INDEX}
          renderItem={(application: Application) => (
            <ProjectCard projectId={application.project_id} key={application.project_id} />
          )}
        />
      ) : (
        <div style={{ alignSelf: "flex-start", margin: "24px 0px" }}>No projects</div>
      )}
    </div>
  );
};

ProjectsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};

export default ProjectsTab;
