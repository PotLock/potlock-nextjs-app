import { ReactElement } from "react";

import { useRouter } from "next/router";

import { ProfileLayout } from "@/entities/profile";
import AboutItem from "@/entities/profile/components/AboutItem";
import Github from "@/entities/profile/components/Github";
import SmartContract from "@/entities/profile/components/SmartContract";
import Team from "@/entities/profile/components/Team";
import useProfileData from "@/entities/profile/hooks/data";

const HomeTab = () => {
  const router = useRouter();
  const { userId: userIdPathParam } = router.query;

  const userId = typeof userIdPathParam === "string" ? userIdPathParam : userIdPathParam?.at(0);

  const { profile, profileType } = useProfileData(userId);

  return (
    <div className="mb-18 flex w-full flex-col">
      {/* Header Container */}
      <div className="gap-2xl flex flex-col items-start justify-start">
        <h2 className="font-500 md:text-[40px] font-lora text-[32px] text-[#2e2e2e]">
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
};

HomeTab.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export default HomeTab;
