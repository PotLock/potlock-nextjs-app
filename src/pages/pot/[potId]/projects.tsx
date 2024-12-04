import { ReactElement, useMemo, useState } from "react";

import { useRouter } from "next/router";

import { PotApplication, PotApplicationStatus, indexer } from "@/common/api/indexer";
import { InfiniteScroll, SearchBar } from "@/common/ui/components";
import { ProjectCard } from "@/entities/project";
import { PotLayout } from "@/layout/PotLayout";

const handleSearch = (
  searchTerm: string,
  { applicant: { id: accountId, near_social_profile_data: socialProfile } }: PotApplication,
) =>
  [
    accountId,
    socialProfile?.description,
    socialProfile?.name,
    socialProfile?.plCategories,
    socialProfile?.plTeam,
  ].some((item) => (item || "").toLowerCase().includes(searchTerm));

// TODO: Finish refactoring by integrating backend search and replacing the infinite scroll with pagination
export default function PotProjectsTab() {
  const router = useRouter();
  const { potId } = router.query as { potId: string };

  const { data: potApplications } = indexer.usePotApplications({
    potId,
    page_size: 999,
    status: PotApplicationStatus.Approved,
  });

  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [index, setIndex] = useState(1);

  const [searchResults, searchResultsCount] = useMemo(() => {
    if (searchTerm !== null && searchTerm.length > 0) {
      const results = (potApplications?.results ?? []).filter((application) =>
        handleSearch(searchTerm, application),
      );

      return [results, results.length];
    } else return [potApplications?.results ?? [], potApplications?.count ?? 0];
  }, [searchTerm, potApplications]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col gap-5">
        <div className="font-600 text-[18px] text-[#292929]">
          <span>{"All Projects"}</span>
          <span className="ml-4">{searchResultsCount}</span>
        </div>

        <div className="flex w-full items-center gap-4">
          <SearchBar
            placeholder="Search projects"
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />
        </div>
      </div>

      {searchResultsCount > 0 ? (
        <InfiniteScroll
          className="p-0.5"
          items={searchResults}
          index={index}
          setIndex={setIndex}
          size={9}
          renderItem={({ applicant }: PotApplication) => (
            <ProjectCard projectId={applicant.id} key={applicant.id} />
          )}
        />
      ) : (
        <div style={{ alignSelf: "flex-start", margin: "24px 0px" }}>No projects</div>
      )}
    </div>
  );
}

PotProjectsTab.getLayout = function getLayout(page: ReactElement) {
  return <PotLayout>{page}</PotLayout>;
};
