import { ReactElement } from "react";

import { useRouter } from "next/router";

import { useAccountSocialProfile } from "@/entities/_shared/account";
import Team from "@/entities/project/components/Team";
import AboutItem from "@/layout/profile/components/AboutItem";
import Github from "@/layout/profile/components/Github";
import { ProfileLayout } from "@/layout/profile/components/ProfileLayout";
import SmartContract from "@/layout/profile/components/SmartContract";

export default function ProfileHomeTab() {
  const router = useRouter();
  const { userId: accountId } = router.query as { userId: string };
  const { profile, profileType } = useAccountSocialProfile({ accountId });

  return (
    <div className="mb-18 flex w-full flex-col">
      {/* Header Container */}
      <div className="gap-2xl flex flex-col items-start justify-start">
        <h2 className="font-500 font-lora text-[32px] text-[#2e2e2e] md:text-[40px]">
          About {profile?.name}
        </h2>
      </div>
      <AboutItem title="Overview" text={profile?.description} />
      {/* INFO: It's needed to have home for regular users as well as pages redirection sends user to /home page (check middleware.ts file) */}
      {profileType === "project" && (
        <>
          <AboutItem
            title="Why we are a public good"
            text={profile?.plPublicGoodReason || "None provided"}
          />
          <Team profile={profile} />
          <AboutItem title="Github repo(s)" element={<Github profile={profile} />} />
          <AboutItem title="Smart contracts" element={<SmartContract profile={profile} />} />
        </>
      )}
    </div>
  );
}

ProfileHomeTab.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};
