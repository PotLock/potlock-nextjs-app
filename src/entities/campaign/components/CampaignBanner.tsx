import { LazyLoadImage } from "react-lazy-load-image-component";

import { campaignsContractHooks } from "@/common/contracts/core/campaigns";
import { yoctoNearToFloat } from "@/common/lib";
import getTimePassed from "@/common/lib/getTimePassed";
import type { ByCampaignId } from "@/common/types";
import { SocialsShare, Spinner } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { AccountProfileLink } from "@/entities/_shared/account";
import { useNearToUsdWithFallback } from "@/entities/_shared/token/hooks/_deprecated";
import { DonateToCampaignProjects } from "@/features/donation";

import { CampaignProgressBar } from "./CampaignProgressBar";

export type CampaignBannerProps = ByCampaignId & {};

export const CampaignBanner: React.FC<CampaignBannerProps> = ({ campaignId }) => {
  const {
    isLoading: isCampaignLoading,
    data: campaign,
    error: campaignLoadingError,
  } = campaignsContractHooks.useCampaign({
    campaignId,
  });

  const usdInfo = useNearToUsdWithFallback(
    Number(yoctoNearToFloat((campaign?.total_raised_amount as string) || "0")),
  );

  if (campaignLoadingError) {
    return <h1>Error Loading Campaign</h1>;
  }

  const isStarted = getTimePassed(Number(campaign?.start_ms), true)?.includes("-");

  const isEnded = campaign?.end_ms
    ? getTimePassed(Number(campaign?.end_ms), false, true)?.includes("-")
    : false;

  return isCampaignLoading ? (
    <div className="flex h-40 items-center justify-center">
      <Spinner className="h-7 w-7" />
    </div>
  ) : (
    <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:gap-0">
      <div className="w-full rounded-xl  border border-gray-300 md:w-[70%]">
        <div className="relative">
          <LazyLoadImage
            className="inset-1 h-[348px] w-full rounded-xl object-cover md:rounded"
            src={campaign?.cover_image_url || "/assets/images/list-gradient-3.png"}
          />
          <div className="absolute inset-0 bottom-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>{" "}
          <div className="absolute bottom-0 z-40 flex flex-col items-start gap-2 p-4">
            <h1 className="text-[24px] font-bold text-white">{campaign?.name}</h1>

            <div
              className={cn(
                "text-foreground flex flex-col items-start gap-2 p-0 text-[12px] text-white",
                "md:flex-row md:items-center md:text-[15px]",
              )}
            >
              <div className="flex gap-1">
                <p className="pr-1 font-semibold">FOR</p>
                <AccountProfileLink
                  classNames={{ root: "bg-transparent" }}
                  accountId={campaign?.recipient as string}
                />
              </div>
              <div className="hidden flex-col items-center bg-gray-800 md:flex">
                <span className="bg-background h-[18px] w-[2px] text-white" />{" "}
              </div>
              <div className="flex gap-1">
                <p className="font-semibold">ORGANIZED BY</p>
                <AccountProfileLink accountId={campaign?.owner as string} />
              </div>
            </div>
          </div>
        </div>
        <p className="p-6">{campaign?.description}</p>
      </div>
      <div className="h-max w-full rounded-xl border border-[#DBDBDB] p-4 md:w-[27%]">
        <div className="mb-5 border border-solid border-[#f4b37d] bg-[#fef6ee] p-4">
          <p className="text-[11px] font-semibold tracking-widest text-[#EA6A25]">
            TOTAL AMOUNT RAISED
          </p>
          <div className="flex items-baseline">
            <h1 className="text-xl font-semibold">
              {yoctoNearToFloat(campaign?.total_raised_amount || "0")} NEAR
            </h1>
            {campaign?.total_raised_amount && <h2 className="text-base">{usdInfo}</h2>}
          </div>
        </div>
        <CampaignProgressBar
          target={campaign?.target_amount ? yoctoNearToFloat(campaign?.target_amount) : 0}
          minAmount={campaign?.min_amount ? yoctoNearToFloat(campaign?.min_amount) : 0}
          targetMet={
            !!campaign?.total_raised_amount &&
            yoctoNearToFloat(campaign?.total_raised_amount) >=
              yoctoNearToFloat(campaign?.target_amount)
          }
          isStarted={isStarted}
          isEscrowBalanceEmpty={campaign?.escrow_balance === "0"}
          amount={
            campaign?.total_raised_amount ? yoctoNearToFloat(campaign?.total_raised_amount) : 0
          }
          endDate={Number(campaign?.end_ms)}
        />
        <div className="mt-6">
          <DonateToCampaignProjects
            className="mb-4"
            disabled={
              isStarted || isEnded || campaign?.total_raised_amount === campaign?.max_amount
            }
            {...{ campaignId }}
          />
          <SocialsShare variant="button" />
        </div>
      </div>
    </div>
  );
};
