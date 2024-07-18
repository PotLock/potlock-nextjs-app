import { useEffect, useState } from "react";

import { getImage } from "@/common/api/images";
import {
  NEARSocialUserProfile,
  getSocialProfile,
} from "@/common/contracts/social";

const useProfileData = (accountId?: string, useCache: boolean = true) => {
  const [profile, setProfile] = useState<NEARSocialUserProfile>();
  const [profileImages, setProfileImages] = useState({
    image: "",
    backgroundImage: "",
  });
  const [profileReady, setProfileReady] = useState(false);

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

        const image = getImage({
          image: projectProfileData?.image,
          type: "image",
        });
        const backgroundImage = getImage({
          image: projectProfileData?.backgroundImage,
          type: "backgroundImage",
        });

        const images = await Promise.all([image, backgroundImage]);

        setProfileImages({
          image: images[0],
          backgroundImage: images[1],
        });

        setProfile(projectProfileData || undefined);
        setProfileReady(true);
      }
    })();
  }, [accountId, useCache]);

  return { profile, profileImages, profileReady };
};

export default useProfileData;
