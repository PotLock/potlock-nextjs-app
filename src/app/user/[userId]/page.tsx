// import DonationsInfo from "@/modules/profile/components/DonationsInfo";

import Info from "@/modules/profile/components/Info";
import ProfileBanner from "@/modules/profile/components/ProfileBanner";
import ProjectBanner from "@/modules/project/components/ProjectBanner";

export default async function Project({
  params,
}: {
  params: { userId: string; potId?: string };
}) {
  return (
    <main className="flex flex-col">
      <ProjectBanner projectId={params.userId} />
      <ProfileBanner isProject={true} accountId={params.userId} />
      <Info accountId={params.userId} />
      {/* <DonationsInfo accountId={params.userId} potId={params.potId} /> */}
    </main>
  );
}
