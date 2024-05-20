"use client";

import { UNREGISTERED_PROJECT } from "@app/app/(profile)/project/[projectId]/statuses";
import { Registration } from "@app/services/contracts/potlock/interfaces/lists.interfaces";
import { get_registration } from "@app/services/contracts/potlock/lists";
import {
  NEARSocialUserProfile,
  RegistrationSocialProfile,
  get_user_profile,
} from "@app/services/contracts/social";
import { get_is_human } from "@app/services/contracts/sybil.nadabot";
import { get_image } from "@app/utils/imageHelpers";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { projectStatusIcons } from "@app/constants/ProjectStatusIcons";

type Props = {
  accountId: string; // near address (donor | proejct)
  isProject: boolean;
  profile?: NEARSocialUserProfile;
  imageStyle?: any;
  backgroundStyle?: any;
  containerStyle?: any;
};

const BannerHeader = (props: Props) => {
  const { isProject, accountId, profile: _profile } = props;

  const [registration, setRegistration] =
    useState<Registration>(UNREGISTERED_PROJECT);
  const [profile, setProfile] = useState({
    image: "",
    backgroundImage: "",
  });
  const [nadaBotVerified, setNadaBotVerified] = useState(false);

  const fetchRegistration = async () => {
    try {
      const registration =
        (await get_registration({
          registrant_id: accountId,
        })) || UNREGISTERED_PROJECT;
      setRegistration(registration);
    } catch (error) {
      console.log("error fetching project ", error);
    }
  };

  const fetchHumanStatus = async () => {
    const isHuman = await get_is_human({ account_id: accountId });
    setNadaBotVerified(isHuman);
  };

  const fetchUserProfile = async () => {
    const profile = await get_user_profile({ accountId });
    const image = get_image(undefined, profile?.image, "image");
    const backgroundImage = get_image(undefined, profile?.backgroundImage);

    const images = await Promise.all([image, backgroundImage]);
    setProfile({
      image: images[0],
      backgroundImage: images[1],
    });
  };

  useEffect(() => {
    if (isProject) {
      fetchRegistration();
    } else {
      fetchHumanStatus();
    }
    fetchUserProfile();
  }, []);

  return (
    <div className="relative">
      {/* profile Background  */}
      <div className="relative h-[318px] w-full">
        {profile.backgroundImage ? (
          <Image
            layout="fill"
            className="object-cover"
            alt="background-image"
            src={profile.backgroundImage}
          />
        ) : (
          <Skeleton className="h-full w-full" />
        )}
      </div>

      {/* profile image */}
      <div className="relative z-[6] flex -translate-y-2/4 items-end pl-2 md:pl-16">
        {/*  image */}

        <div className="relative h-[120px] w-[120px] rounded-full bg-white p-1.5">
          {profile.image ? (
            <Avatar className="h-full w-full">
              <AvatarImage src={profile.image} alt="profile-image" />
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
        </div>
      </div>
    </div>
  );
};

export default BannerHeader;
