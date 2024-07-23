import { ReactElement } from "react";

import { useRouter } from "next/router";

import { ProfileLayout } from "@/modules/profile";
import AboutItem from "@/modules/profile/components/AboutItem";
import Github from "@/modules/profile/components/Github";
import SmartContract from "@/modules/profile/components/SmartContract";
import Team from "@/modules/profile/components/Team";
import useProfileData from "@/modules/profile/hooks/useProfileData";

const HomeSubPage = () => {
  const router = useRouter();
  const { userId: userIdPathParam } = router.query;

  const userId =
    typeof userIdPathParam === "string"
      ? userIdPathParam
      : userIdPathParam?.at(0);

  const { profile } = useProfileData(userId);

  return (
    <div className="mb-18 flex w-full flex-col">
      {/* Header Container */}
      <div className="gap-2xl flex flex-col items-start justify-start">
        <h2 className="font-500 md:text-[40px] font-lora text-[32px] text-[#2e2e2e]">
          About {profile?.name}
        </h2>
      </div>
      <AboutItem title="Overview" text={profile?.description} />
      <AboutItem
        title="Why we are a public good"
        text={profile?.plPublicGoodReason || "None provided"}
      />
      <Team profile={profile} />
      <AboutItem
        title="Github repo(s)"
        element={<Github profile={profile} />}
      />
      <AboutItem
        title="Smart contracts"
        element={<SmartContract profile={profile} />}
      />
    </div>
  );
};

HomeSubPage.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export default HomeSubPage;
