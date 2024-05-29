import ProfileBanner from "@/modules/profile/components/ProfileBanner";
import ProjectBanner from "@/modules/project/components/ProjectBanner";

export default async function Project({
  params,
}: {
  params: { userId: string };
}) {
  return (
    <main className="flex flex-col">
      <ProjectBanner projectId={params.userId} />
      <ProfileBanner isProject={true} accountId={params.userId} />
    </main>
  );
}
