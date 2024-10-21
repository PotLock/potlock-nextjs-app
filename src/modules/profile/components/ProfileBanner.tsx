import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Skeleton,
} from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { useIsHuman, useRegistration } from "@/modules/core";
import { projectStatusIcons } from "@/modules/project/components/ProjectStatusIcons";

import { FollowStats } from "./FollowStats";
import { useProfileData } from "../hooks/data";

export type ProfileBannerProps = {
  accountId: string; // near address (donor | project)
  isProject: boolean;
  imageStyle?: any;
  backgroundStyle?: any;
  containerStyle?: any;
};

export const ProfileBanner: React.FC<ProfileBannerProps> = ({
  isProject,
  accountId,
}) => {
  const { avatarSrc, backgroundSrc } = useProfileData(accountId);

  // get nadabot status on the donor page
  let nadaBotVerified = false;
  const isHuman = useIsHuman(accountId);
  if (!isHuman.loading && !isProject) {
    nadaBotVerified = isHuman.nadaBotVerified;
  }

  // get registration if it is on project page
  const { registration } = useRegistration(accountId);

  return (
    <section un-position="relative">
      {/* profile Background  */}
      <div className="relative h-[318px] w-full">
        {backgroundSrc ? (
          <img
            className="h-full w-full rounded-xl object-cover"
            alt="background-image"
            src={backgroundSrc}
          />
        ) : (
          <Skeleton className="h-full w-full" />
        )}
      </div>

      {/* profile image */}
      <div className="md:pl-16 relative z-[6] flex -translate-y-2/4 items-end pl-2">
        <div
          className={cn(
            "p-1.25 relative h-[120px] w-[120px] rounded-full bg-white",
            "max-[400px]:h-[90px] max-[400px]:w-[90px]",
          )}
        >
          {avatarSrc ? (
            <Avatar className="h-full w-full">
              <AvatarImage src={avatarSrc} alt="profile-image" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          ) : (
            <Skeleton className="h-full w-full rounded-full" />
          )}
        </div>

        {/* Status */}
        <div
          className={cn(
            "md:gap-6 relative z-[1] flex -translate-y-5 translate-x-[-25px] items-center gap-2",
          )}
        >
          {registration.id ? (
            <div
              className={cn(
                "flex items-center gap-1 overflow-hidden rounded-[20px] bg-white",
                "p-[3px] text-[11px] uppercase tracking-[0.88px] opacity-100",
              )}
            >
              {projectStatusIcons[registration.status].icon}

              <div
                className="md:block hidden"
                style={{ color: projectStatusIcons[registration.status].color }}
              >
                {registration.status}
              </div>
            </div>
          ) : nadaBotVerified ? (
            <div
              className={cn(
                "flex items-center gap-1 overflow-hidden rounded-[20px] bg-white",
                "p-[3px] text-[11px] uppercase tracking-[0.88px] opacity-100",
              )}
            >
              {projectStatusIcons.Approved.icon}

              <div style={{ color: projectStatusIcons.Approved.color }}>
                Verified
              </div>
            </div>
          ) : (
            <div style={{ width: "10px" }} />
          )}

          <FollowStats accountId={accountId} />
        </div>
      </div>
    </section>
  );
};

export default ProfileBanner;
