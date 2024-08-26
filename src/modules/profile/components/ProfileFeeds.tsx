import { useEffect } from "react";

import { getPostFeeds } from "@/common/contracts/social";

const ProfileFeeds = () => {
  const accountId: string = "agwaze.near";

  useEffect(() => {
    const fetchSocialFeeds = async () => {
      const data = await getPostFeeds({ accountId });
      console.log(data);
    };
    fetchSocialFeeds();
  }, []);

  return <div>ProfileFeeds</div>;
};

export default ProfileFeeds;
