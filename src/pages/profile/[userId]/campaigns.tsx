import { ReactElement, useEffect, useState } from "react";

import { Campaign } from "@/common/contracts/potlock";
import { get_campaigns_by_owner } from "@/common/contracts/potlock/campaigns";
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
    get_campaigns_by_owner({ owner_id: userId as AccountId })
      .then((fetchedCampaigns) => {
        setCampaigns(fetchedCampaigns);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
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
