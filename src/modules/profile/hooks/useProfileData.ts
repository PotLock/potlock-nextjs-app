import { useEffect, useState } from "react";

import {
  NEARSocialUserProfile,
  getSocialProfile,
} from "@/common/contracts/social";
import { fetchSocialImages } from "@/modules/core/services/socialImages";

const useProfileData = (accountId?: string) => {
  const [profile, setProfile] = useState<NEARSocialUserProfile>();
  const [profileImages, setProfileImages] = useState({
    image: "",
    backgroundImage: "",
  });

  // Fetch profile data
  useEffect(() => {
    (async () => {
      if (accountId) {
        const projectProfileData = await getSocialProfile({ accountId });
        setProfile(projectProfileData);
      }
    })();
  }, [accountId]);

  useEffect(() => {
    (async () => {
      if (profile && accountId) {
        try {
          const imagesData = await fetchSocialImages({
            socialData: profile,
            accountId,
          });

          setProfileImages({
            image: imagesData.image,
            backgroundImage: imagesData.backgroundImage,
          });
        } catch (e) {
          console.error("Fetch Social Images:", e);
        }
      }
    })();
  }, [profile, accountId]);

  return { profile, profileImages };
};

export default useProfileData;
