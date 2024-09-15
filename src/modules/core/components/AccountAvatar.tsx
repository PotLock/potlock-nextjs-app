/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

import useProfileData from "@/modules/profile/hooks/useProfileData";

const NO_IMAGE =
  "https://ipfs.near.social/ipfs/bafkreiccpup6f2kihv7bhlkfi4omttbjpawnsns667gti7jbhqvdnj4vsm";

export const AccountAvatar = ({
  accountId,
  className,
}: {
  accountId?: string;
  className?: string;
}) => {
  const profileInfo = useProfileData(accountId);
  const [hasError, setHasError] = useState(false);

  const imageSrc =
    typeof profileInfo.profile?.image === "string"
      ? profileInfo.profile.image
      : profileInfo.profile?.image?.url ?? profileInfo.profileImages.image;

  return (
    <img
      alt="avatar"
      className={`h-[12px] w-[12px] rounded-[50%] bg-white ${className}`}
      src={hasError ? NO_IMAGE : imageSrc}
      onError={() => setHasError(true)}
    />
  );
};
