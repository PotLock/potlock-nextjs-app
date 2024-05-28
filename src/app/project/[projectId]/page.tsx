import BannerHeader from "@/modules/profile/components/ProfileBanner";
import ProjectBanner from "@/modules/project/components/ProjectBanner";

export default async function Project({
  params,
}: {
  params: { projectId: string };
}) {
  return (
    <main className="flex flex-col">
      <ProjectBanner projectId={params.projectId} />
      <BannerHeader isProject={true} accountId={params.projectId} />
    </main>
  );
}
