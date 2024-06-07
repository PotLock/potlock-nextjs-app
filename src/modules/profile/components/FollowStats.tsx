"use client";

import { useEffect, useState } from "react";

import { getFollowers, getFollowing } from "@/common/contracts/social";

const FollowStats = ({ accountId }: { accountId: string }) => {
  const [following, setFollowing] = useState(0);
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
    const fetchSocialData = async () => {
      const _following = await getFollowing({ accountId });
      setFollowing(_following.total);
      console.log(_following);

      const _followers = await getFollowers({ accountId });
      setFollowers(_followers.total);
      console.log(_followers);
    };

    if (accountId) {
      fetchSocialData();
    }
  }, [accountId]);

  // TODO
  return <div>FollowStats WIP</div>;
};

export default FollowStats;
