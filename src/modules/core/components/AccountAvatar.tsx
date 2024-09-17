/* eslint-disable @next/next/no-img-element */

import { useMemo } from "react";

import useProfileData from "@/modules/profile/hooks/data";

export const AccountAvatar = ({
  accountId,
  className,
}: {
  accountId?: string;
  className?: string;
}) => {
  const profileInfo = useProfileData(accountId);

  const imageSrc = useMemo(
    () =>
      typeof profileInfo.profile?.image === "string"
        ? profileInfo.profile.image
        : profileInfo.profile?.image?.url ?? profileInfo.profileImages.image,

    [profileInfo.profile?.image, profileInfo.profileImages.image],
  );

  return (
    <img
      alt="avatar"
      className={`h-[12px] w-[12px] rounded-[50%] bg-white ${className}`}
      src={imageSrc}
    />
  );
};
