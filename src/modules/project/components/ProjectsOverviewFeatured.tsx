import { NETWORK } from "@/common/config";
import { ProjectCard } from "@/modules/project";

const featuredProjectIds =
  NETWORK === "mainnet"
    ? ["v1.foodbank.near", "potlock.near", "yearofchef.near"]
    : ["amichaeltest.testnet", "root.akaia.testnet", "yearofchef.testnet"];

export const ProjectsOverviewFeatured = () => {
  return (
    <div className="md:px-10 md:pt-12 flex w-full flex-col gap-10 px-2 pt-10">
      <div className="flex w-full flex-col gap-5">
        <div className="text-sm font-medium uppercase leading-6 tracking-[1.12px] text-[#292929]">
          Featured projects
        </div>
      </div>

      <div className="md:grid-cols-2 lg:grid-cols-3 grid w-full grid-cols-1 gap-8 p-0.5">
        {featuredProjectIds.map((projectId) => (
          <ProjectCard key={projectId} projectId={projectId} />
        ))}
      </div>
    </div>
  );
};
