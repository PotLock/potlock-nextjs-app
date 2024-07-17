import { useEffect, useState } from "react";

import {
  NEARSocialUserProfile,
  getSocialProfile,
} from "@/common/contracts/social";
import { fetchSocialImages } from "@/modules/core/services/socialImages";

const useProfileData = (accountId?: string, useCache: boolean = true) => {
  const [profile, setProfile] = useState<NEARSocialUserProfile>();
  const [profileImages, setProfileImages] = useState({
    image: "",
    backgroundImage: "",
  });
  const [imagesReady, setImagesReady] = useState(false);
  const [profileReady, setProfileReady] = useState(false);

  // Fetch profile data
  useEffect(() => {
    (async () => {
      if (accountId) {
        const projectProfileData = await getSocialProfile({
          accountId,
          useCache,
        });
        setProfile(projectProfileData || undefined);
        setProfileReady(true);
      } else {
        setProfileReady(true);
      }
    })();
  }, [accountId, useCache]);

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

          setImagesReady(true);
        } catch (e) {
          console.error("Fetch Social Images:", e);
          setImagesReady(true);
        }
      } else {
        setImagesReady(true);
      }
    })();
  }, [profile, accountId]);

  return { profile, profileImages, imagesReady, profileReady };
};

export default useProfileData;
