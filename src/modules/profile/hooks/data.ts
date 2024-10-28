import { useEffect, useMemo, useState } from "react";

import { getImage } from "@/common/api/images";
import { useAccountDonationsSent } from "@/common/api/indexer/hooks";
import {
  NEARSocialUserProfile,
  getSocialProfile,
} from "@/common/contracts/social";
import useRegistration from "@/modules/core/hooks/useRegistration";

export const useProfileData = (
  accountId?: string,
  useCache: boolean = true,
  getDonationsSent = true,
) => {
  const [profile, setProfile] = useState<NEARSocialUserProfile>();
  const [profileImages, setProfileImages] = useState({
    image: "",
    backgroundImage: "",
  });
  const [profileReady, setProfileReady] = useState(false);

  // Donations
  const { data: donationsData } = useAccountDonationsSent({
    accountId: getDonationsSent ? accountId || "" : "",
    page_size: 9999,
  });

  // Registration
  const registration = useRegistration(accountId || "");

  const profileType = registration.registration.id ? "project" : "user";

  // Fetch profile data
  useEffect(() => {
    (async () => {
      if (accountId) {
        setProfileReady(false);
        setProfile(undefined);

        const projectProfileData = await getSocialProfile({
          accountId,
          useCache,
        });

        const images = await Promise.all([
          getImage({ image: projectProfileData?.image, type: "image" }),

          getImage({
            image: projectProfileData?.backgroundImage,
            type: "backgroundImage",
          }),
        ]);

        setProfileImages({
          image: images[0],
          backgroundImage: images[1],
        });

        setProfile(projectProfileData || undefined);
        setProfileReady(true);
      }
    })();
  }, [accountId, useCache]);

  const avatarSrc = useMemo(
    () =>
      (typeof profile?.image === "string"
        ? profile?.image
        : (profile?.image?.url ??
          (profile?.image?.ipfs_cid
            ? `https://ipfs.near.social/ipfs/${profile?.image?.ipfs_cid}`
            : null))) ?? profileImages.image,

    [profile?.image, profileImages.image],
  );

  const backgroundSrc = useMemo(
    () =>
      (typeof profile?.backgroundImage === "string"
        ? profile?.backgroundImage
        : (profile?.backgroundImage?.url ??
          (profile?.backgroundImage?.ipfs_cid
            ? `https://ipfs.near.social/ipfs/${profile?.backgroundImage?.ipfs_cid}`
            : null))) ?? profileImages.backgroundImage,

    [profile?.backgroundImage, profileImages.backgroundImage],
  );

  return {
    /** @deprecated use `avatarSrc` and `backgroundSrc` */
    profileImages,
    avatarSrc,
    backgroundSrc,
    donationsSent: donationsData?.results,
    profile,
    profileReady,
    profileType,
    registration,
  };
};

export default useProfileData;
