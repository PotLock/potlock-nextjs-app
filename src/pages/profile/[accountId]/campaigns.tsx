import { ReactElement } from "react";

import { useRouter } from "next/router";

import { Campaign, indexer } from "@/common/api/indexer";
import { NoResultsPlaceholder, PageError, SplashScreen } from "@/common/ui/layout/components";
import { CampaignCard } from "@/entities/campaign";
import { ProfileLayout } from "@/layout/profile/components/layout";

export default function ProfileCampaignsTab() {
  const router = useRouter();
  const { accountId } = router.query as { accountId: string };

  const {
    data: campaigns,
    isLoading: isCampaignsListLoading,
    error: campaignsLoadingError,
  } = indexer.useCampaigns({ owner: accountId });

  return (
    <div className="w-full">
      {campaignsLoadingError !== undefined && (
        <PageError
          title="Unable to load campaigns"
          message={"message" in campaignsLoadingError ? campaignsLoadingError.message : undefined}
        />
      )}

      {campaignsLoadingError === undefined && campaigns === undefined && isCampaignsListLoading && (
        <SplashScreen className="h-100" />
      )}

      {campaignsLoadingError === undefined && campaigns !== undefined && (
        <>
          {campaigns?.results?.length > 0 ? (
            <div className="my-10 grid gap-2 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {campaigns?.results?.map((campaign: Campaign) => (
                <CampaignCard data={campaign} key={campaign.on_chain_id} />
              ))}
            </div>
          ) : (
            <NoResultsPlaceholder text="This Project has no Campaigns" />
          )}
        </>
      )}
    </div>
  );
}

ProfileCampaignsTab.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};
