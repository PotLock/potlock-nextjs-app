import BannerHeader from "@app/components/shared/ProfileBanner";

import ProjectBanner from "./ProjectBanner";

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
