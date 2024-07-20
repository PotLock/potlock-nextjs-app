import { useParams } from "next/navigation";

import AboutItem from "@/modules/profile/components/AboutItem";
import Github from "@/modules/profile/components/Github";
import SmartContract from "@/modules/profile/components/SmartContract";
import Team from "@/modules/profile/components/Team";
import useProfileData from "@/modules/profile/hooks/useProfileData";

const HomeSubPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { profile } = useProfileData(userId);

  return (
    <div className="mb-18 flex w-full flex-col">
      {/* Header Container */}
      <div className="gap-2xl flex flex-col items-start justify-start">
        <h2 className="font-500 font-lora text-[32px] text-[#2e2e2e] md:text-[40px]">
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

export default HomeSubPage;
