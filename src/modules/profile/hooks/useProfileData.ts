import { useEffect, useState } from "react";

import {
  NEARSocialUserProfile,
  getSocialProfile,
} from "@/common/contracts/social";

const useProfileData = (accountId: string) => {
  const [profile, setProfile] = useState<NEARSocialUserProfile>();

  // Fetch profile data
  useEffect(() => {
    (async () => {
      if (accountId) {
        const projectProfileData = await getSocialProfile({ accountId });
        setProfile(projectProfileData);
      }
    })();
  }, [accountId]);

  return profile;
};

export default useProfileData;
