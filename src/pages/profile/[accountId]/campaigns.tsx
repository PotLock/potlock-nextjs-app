import { ReactElement } from "react";

import { useRouter } from "next/router";

import { campaignsContractHooks } from "@/common/contracts/core/campaigns";
import { NoResultsPlaceholder, PageError, SplashScreen } from "@/common/ui/components";
import { CampaignCard } from "@/entities/campaign";
import { ProfileLayout } from "@/layout/profile/components/layout";

export default function ProfileCampaignsTab() {
  const router = useRouter();
  const { accountId } = router.query as { accountId: string };

  const {
    isLoading: isCampaignsListLoading,
    data: campaigns,
    error: campaignsLoadingError,
  } = campaignsContractHooks.useOwnedCampaigns({ accountId });

  // TODO: Use skeletons instead of the splash screen
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
          {campaigns.length > 0 ? (
            <div className="my-4 flex flex-wrap gap-8">
              {campaigns.map((campaign) => (
                <CampaignCard data={campaign} key={campaign.id} />
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
