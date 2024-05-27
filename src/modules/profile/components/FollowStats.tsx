"use client";

import { useEffect } from "react";

import { getSocialData } from "@app/contracts/social";

const FollowStats = ({ accountId }: { accountId: string }) => {
  useEffect(() => {
    console.log("accountId", accountId);

    const fetchSocialData = async () => {
      const following = await getSocialData({
        args: {
          keys: [`${accountId}/graph/follow/*`],
          options: {
            return_type: "BlockHeight",
            values_only: true,
          },
        },
        method: "keys",
      });
      //   const followers = await getSocialData({
      //     args: {
      //       keys: [`*/graph/follow/${accountId}`],
      //       options: {
      //         return_type: "BlockHeight",
      //         values_only: true,
      //       },
      //     },
      //     method: "keys",
      //   });
      //   console.log("followers", followers);
      console.log("following", following);
    };
    fetchSocialData();
  }, [accountId]);

  //   return_type: "BlockHeight",

  //   values_only: true,

  return <div>FollowStats</div>;
};

export default FollowStats;
