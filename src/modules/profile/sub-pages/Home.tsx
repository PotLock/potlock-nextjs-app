"use client";

import { useParams } from "next/navigation";

import AboutItem from "../components/AboutItem";
import useProfileData from "../hooks/useProfileData";

const HomeSubPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const profile = useProfileData(userId);
  console.log(profile);

  return (
    <div className="flex w-full flex-col">
      {/* Header Container */}
      <div className="gap-2xl flex flex-col items-start justify-start">
        <h2 className="font-500 font-lora text-[32px] text-[#2e2e2e] md:text-[40px]">
          About {profile?.name}
        </h2>
      </div>
      {/* <AboutItem title="Overview" text={markdown} /> */}
      {/* <AboutItem title="Why we are a public good" text={plPublicGoodReason || "None provided"} /> */}
      <AboutItem title="Why we are a public good" text={"None provided"} />
      {/* {team} */}
      {/* <AboutItem title="Github repo(s)" text={github} /> */}
      {/* <AboutItem title="Smart contracts" text={smartContractsItems} /> */}
    </div>
  );
};

export default HomeSubPage;
