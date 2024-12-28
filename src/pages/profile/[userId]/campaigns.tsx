import { ReactElement, useEffect, useState } from "react";

import { useRouter } from "next/router";

import { Campaign, campaignsClient } from "@/common/contracts/core";
import { CampaignCard } from "@/entities/campaign/components";
import { ProfileLayout } from "@/layout/profile/components/ProfileLayout";

import { NoResults } from "./lists";

const ProfileCampaigns = () => {
  const router = useRouter();
  const { userId: accountId } = router.query as { userId: string };
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    campaignsClient
      .get_campaigns_by_owner({ owner_id: accountId })
      .then((fetchedCampaigns) => {
        setCampaigns(fetchedCampaigns);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [accountId]);

  return (
    <div className="w-full">
      {campaigns?.length ? (
        <div className="my-4 flex flex-wrap gap-8">
          {campaigns?.map((data) => <CampaignCard data={data} key={data.id} />)}
        </div>
      ) : (
        <NoResults text="This Project has no Campaigns" />
      )}
    </div>
  );
};

ProfileCampaigns.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export default ProfileCampaigns;
