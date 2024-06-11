"use client";

import { useEffect, useState } from "react";

import { getFollowers, getFollowing } from "@/common/contracts/social";

type Props = {
  accountId: string;
  onFollowerClick?: () => void;
  onFollowingClick?: () => void;
};

const FollowStats = ({
  accountId,
  onFollowerClick,
  onFollowingClick,
}: Props) => {
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
  return (
    <div className="flex items-center gap-4 text-sm max-[400px]:mt-2 md:gap-8">
      <button
        className="bg-[rgb(33, 37, 41)] flex gap-2"
        onClick={onFollowerClick}
      >
        <span style={{ fontWeight: 600 }}>{followers}</span>
        Follower
      </button>

      <button
        className="bg-[rgb(33, 37, 41)] flex gap-2"
        onClick={onFollowerClick}
      >
        <span style={{ fontWeight: 600 }} onClick={onFollowingClick}>
          {following}
        </span>
        Following
      </button>
    </div>
  );
};

export default FollowStats;
