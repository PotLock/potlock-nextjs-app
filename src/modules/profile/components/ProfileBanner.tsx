"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { NEARSocialUserProfile } from "@/common/contracts/social";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Skeleton,
} from "@/common/ui/components";
import useIsHuman from "@/modules/core/hooks/useIsHuman";
import useRegistration from "@/modules/core/hooks/useRegistration";
import { fetchSocialImages } from "@/modules/core/services/socialImages";
import { projectStatusIcons } from "@/modules/project/components/ProjectStatusIcons";

import FollowStats from "./FollowStats";

type Props = {
  accountId: string; // near address (donor | proejct)
  isProject: boolean;
  profile?: NEARSocialUserProfile;
  imageStyle?: any;
  backgroundStyle?: any;
  containerStyle?: any;
};

const ProfileBanner = (props: Props) => {
  const { isProject, accountId, profile } = props;

  const [profileImages, setProfileImages] = useState({
    image: "",
    backgroundImage: "",
  });

  useEffect(() => {
    (async () => {
      const imagesData = await fetchSocialImages({
        socialData: profile,
        accountId,
      });

      setProfileImages({
        image: imagesData.image,
        backgroundImage: imagesData.backgroundImage,
      });
    })();
  }, [profile, accountId]);

  // get nadabot status on the donor page
  let nadaBotVerified = false;
  const isHuman = useIsHuman(accountId);
  if (!isHuman.loading && !isProject) {
    nadaBotVerified = isHuman.nadaBotVerified;
  }

  // get registration if it is on project page
  const { registration } = useRegistration(accountId);

  return (
    <div className="relative">
      {/* profile Background  */}
      <div className="relative h-[318px] w-full">
        {profileImages.backgroundImage ? (
          <Image
            fill
            className="object-cover"
            alt="background-image"
            src={profileImages.backgroundImage}
          />
        ) : (
          <Skeleton className="h-full w-full" />
        )}
      </div>

      {/* profile image */}
      <div className="relative z-[6] flex -translate-y-2/4 items-end pl-2 md:pl-16">
        {/*  image */}

        <div className="relative h-[120px] w-[120px] rounded-full bg-white p-1.5">
          {profileImages.image ? (
            <Avatar className="h-full w-full">
              <AvatarImage src={profileImages.image} alt="profile-image" />
              <AvatarFallback>PO</AvatarFallback>
            </Avatar>
          ) : (
            <Skeleton className="h-full w-full rounded-full" />
          )}
        </div>
        {/* Status */}
        <div className="relative z-[1] flex -translate-y-5 translate-x-[-25px] items-center gap-6">
          {registration.id ? (
            <div className="flex items-center gap-1 overflow-hidden rounded-[20px] bg-white p-[3px] text-[11px] uppercase tracking-[0.88px] opacity-100">
              {projectStatusIcons[registration.status].icon}
              <div
                style={{
                  color: projectStatusIcons[registration.status].color,
                }}
              >
                {registration.status}
              </div>
            </div>
          ) : nadaBotVerified ? (
            <div className="flex items-center gap-1 overflow-hidden rounded-[20px] bg-white p-[3px] text-[11px] uppercase tracking-[0.88px] opacity-100">
              {projectStatusIcons.Approved.icon}
              <div style={{ color: projectStatusIcons.Approved.color }}>
                Verified
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "10px",
              }}
            />
          )}
          <FollowStats accountId={accountId} />
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;
