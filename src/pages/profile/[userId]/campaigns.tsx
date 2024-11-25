import { ReactElement, useEffect, useState } from "react";

import { Campaign, campaignsClient } from "@/common/contracts/core";
import { useRouteQuery } from "@/common/lib";
import { AccountId } from "@/common/types";
import { CampaignCard } from "@/modules/campaigns/components";
import { ProfileLayout } from "@/modules/profile";

const ProfileCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const {
    query: { userId },
  } = useRouteQuery();

  useEffect(() => {
    campaignsClient
      .get_campaigns_by_owner({ owner_id: userId as AccountId })
      .then((fetchedCampaigns) => {
        setCampaigns(fetchedCampaigns);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userId]);
  return (
    <div className="my-4 flex flex-wrap gap-8">
      {campaigns?.map((data) => <CampaignCard data={data} key={data.id} />)}
    </div>
  );
};

ProfileCampaigns.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export default ProfileCampaigns;
