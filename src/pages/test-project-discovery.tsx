import { ListRegistration } from "@/common/api/indexer";
import { InfiniteScrollTrigger, PageWithBanner } from "@/common/ui/components";
import { ProjectCard, useProjectLookup } from "@/modules/project";

export default function TestProjectDiscovery() {
  const { projects, loadMoreProjects, isProjectLookupPending } =
    useProjectLookup({
      listId: 1,
    });

  return (
    <PageWithBanner>
      <div className="md:px-10 md:py-12 flex w-full flex-col px-2 py-10">
        <div className="md:grid-cols-2 lg:grid-cols-3 mt-8 grid w-full grid-cols-1 gap-8">
          {projects.map(({ id, registrant }: ListRegistration) => (
            <ProjectCard projectId={registrant.id} key={id} />
          ))}

          <InfiniteScrollTrigger
            hasMore={true} // TODO: request number of total items without pagination and pass here
            isLoading={isProjectLookupPending}
            next={loadMoreProjects}
          >
            {<div>{isProjectLookupPending && "Loading..."}</div>}
          </InfiniteScrollTrigger>
        </div>
      </div>
    </PageWithBanner>
  );
}
