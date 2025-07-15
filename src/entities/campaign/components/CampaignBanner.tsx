import { useMemo } from "react";

import { BadgeCheck, CircleAlert } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { isNonNullish, isNullish } from "remeda";
import { Temporal } from "temporal-polyfill";

import { PLATFORM_NAME } from "@/common/_config";
import { NATIVE_TOKEN_ID, PLATFORM_TWITTER_ACCOUNT_ID } from "@/common/constants";
import { campaignsContractHooks } from "@/common/contracts/core/campaigns";
import { indivisibleUnitsToFloat } from "@/common/lib";
import getTimePassed from "@/common/lib/getTimePassed";
import type { ByCampaignId } from "@/common/types";
import { Button, SocialsShare, Spinner } from "@/common/ui/layout/components";
import { BadgeIcon } from "@/common/ui/layout/svg/BadgeIcon";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import { AccountProfileLink } from "@/entities/_shared/account";
import { useFungibleToken } from "@/entities/_shared/token";
import { DonateToCampaign } from "@/features/donation";

import { CampaignProgressBar } from "./CampaignProgressBar";
import { useCampaignForm } from "../hooks/forms";

export type CampaignBannerProps = ByCampaignId & {};

export const CampaignBanner: React.FC<CampaignBannerProps> = ({ campaignId }) => {
  const viewer = useWalletUserSession();

  const {
    isLoading: isCampaignLoading,
    data: campaign,
    error: campaignLoadingError,
  } = campaignsContractHooks.useCampaign({ campaignId });

  const { data: token } = useFungibleToken({ tokenId: campaign?.ft_id ?? NATIVE_TOKEN_ID });

  const raisedAmountFloat = useMemo(
    () =>
      token === undefined || campaign === undefined
        ? 0
        : indivisibleUnitsToFloat(campaign.total_raised_amount, token.metadata.decimals),

    [campaign, token],
  );

  const minAmountFloat = useMemo(
    () =>
      token === undefined || isNullish(campaign?.min_amount)
        ? 0
        : indivisibleUnitsToFloat(campaign.min_amount, token.metadata.decimals),

    [campaign?.min_amount, token],
  );

  const { data: hasEscrowedDonations, isLoading: isHasEscrowedDonationsLoading } =
    campaignsContractHooks.useHasEscrowedDonationsToProcess({
      campaignId,
      enabled: true, // Always enable the hook
    });

  const { data: isDonationRefundsProcessed, isLoading: isDonationRefundsProcessedLoading } =
    campaignsContractHooks.useIsDonationRefundsProcessed({
      campaignId,
      enabled: true, // Always enable the hook
    });

  const { handleProcessEscrowedDonations, handleDonationsRefund } = useCampaignForm({ campaignId });

  const raisedAmountUsdApproximation = useMemo(
    () =>
      token?.usdPrice === undefined
        ? null
        : `~$${token.usdPrice.times(raisedAmountFloat).toFixed(2)}`,

    [raisedAmountFloat, token?.usdPrice],
  );

  if (campaignLoadingError) {
    return <h1>Error Loading Campaign</h1>;
  }

  const isStarted = getTimePassed(Number(campaign?.start_ms), true)?.includes("-");

  const isEnded = campaign?.end_ms
    ? getTimePassed(Number(campaign?.end_ms), false, true)?.includes("-")
    : false;

  // Check if the hooks are still loading
  const isProcessingHooksLoading =
    isHasEscrowedDonationsLoading || isDonationRefundsProcessedLoading;

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
          <div className="absolute bottom-0 z-40 flex w-full flex-col items-start gap-2 p-4">
            <h1 className="text-[24px] font-bold text-white">{campaign?.name}</h1>

            <div
              className={cn(
                "text-foreground flex flex-col-reverse gap-2 p-0",
                "text-[12px] text-white md:text-[15px]",
                "w-full justify-between md:flex-row md:items-center md:items-center",
              )}
            >
              <div className="flex flex-col items-start gap-2 p-0 md:flex-row">
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

              {campaign?.owner === campaign?.recipient && (
                <div className="flex items-center gap-1">
                  <BadgeIcon size={5} />
                  <span className="m-0 font-bold">OFFICIAL</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html: campaign?.description ?? "",
          }}
          onClick={(event) => {
            // Prevent navigation when clicking on links
            if (event.target instanceof HTMLAnchorElement) {
              event.stopPropagation();
            }
          }}
        />
      </div>

      <div className="h-max w-full rounded-xl border border-[#DBDBDB] p-4 md:w-[27%]">
        <div className="mb-5 rounded-xl border border-solid border-[#f4b37d] bg-[#fef6ee] p-4">
          <p className="text-[11px] font-semibold tracking-widest text-[#EA6A25]">
            {"TOTAL AMOUNT RAISED"}
          </p>

          <div className="flex items-baseline">
            <h1 className="text-xl font-semibold">
              {`${raisedAmountFloat} ${token?.metadata.symbol ?? ""}`}
            </h1>

            {raisedAmountUsdApproximation && (
              <h2 className="text-base">{raisedAmountUsdApproximation}</h2>
            )}
          </div>
        </div>

        <CampaignProgressBar
          tokenId={campaign?.ft_id ?? NATIVE_TOKEN_ID}
          amount={campaign?.total_raised_amount ?? `${0}`}
          minAmount={campaign?.min_amount ?? `${0}`}
          target={campaign?.target_amount ?? `${0}`}
          startDate={Number(campaign?.start_ms)}
          isStarted={isStarted}
          isEscrowBalanceEmpty={campaign?.escrow_balance === "0"}
          endDate={Number(campaign?.end_ms)}
        />

        <div className="mt-6">
          {viewer.isSignedIn &&
            !isProcessingHooksLoading &&
            hasEscrowedDonations &&
            isNonNullish(campaign?.min_amount) &&
            raisedAmountFloat >= minAmountFloat && (
              <div className="flex w-full flex-col gap-4">
                <Button className="w-full" onClick={handleProcessEscrowedDonations}>
                  {"Process Payout"}
                </Button>

                <div
                  className={cn(
                    "border-1 flex items-start gap-2",
                    "rounded-lg border-green-500 bg-green-50 p-3",
                  )}
                >
                  <BadgeCheck className="h--12 w-12" />

                  <div className="m-0 p-0">
                    <h2 className="mb-2 text-base font-medium">Campaign Successful</h2>

                    <p className="text-sm font-normal leading-6">
                      The Minimum Target of the Campaign has been successfully reach and the
                      Donations can be processed.
                    </p>
                  </div>
                </div>
              </div>
            )}

          {viewer.isSignedIn &&
            !isProcessingHooksLoading &&
            isDonationRefundsProcessed &&
            campaign?.end_ms &&
            campaign?.end_ms < Temporal.Now.instant().epochMilliseconds &&
            raisedAmountFloat < minAmountFloat && (
              <div className="flex w-full flex-col gap-4">
                <Button className="w-full" onClick={handleDonationsRefund}>
                  {"Refund Donations"}
                </Button>

                <div
                  className={cn(
                    "border-1 flex items-start gap-2",
                    "rounded-lg border-neutral-500 bg-neutral-50 p-3",
                  )}
                >
                  <CircleAlert className="h--12 w-12" />

                  <div className="m-0 p-0">
                    <h2 className="mb-2 text-base font-medium">Campaign Ended</h2>

                    <p className="text-sm font-normal leading-6">
                      {`The campaign has finished and did not meet its minimum goal of ${
                        minAmountFloat
                      } ${
                        token?.metadata.symbol ?? ""
                      }. Initiate the Reverse Process to refund donors.`}
                    </p>
                  </div>
                </div>
              </div>
            )}

          {!isProcessingHooksLoading &&
            (!hasEscrowedDonations ||
              !isNonNullish(campaign?.min_amount) ||
              raisedAmountFloat < minAmountFloat) &&
            (!isDonationRefundsProcessed ||
              !campaign?.end_ms ||
              campaign?.end_ms >= Temporal.Now.instant().epochMilliseconds ||
              raisedAmountFloat >= minAmountFloat) && (
              <>
                <DonateToCampaign
                  cachedTokenId={campaign?.ft_id ?? NATIVE_TOKEN_ID}
                  disabled={
                    isStarted || isEnded || campaign?.total_raised_amount === campaign?.max_amount
                  }
                  className="mb-4"
                  {...{ campaignId }}
                />

                <SocialsShare
                  shareText={`Support ${campaign?.name} Campaign on ${
                    PLATFORM_NAME
                  } by donating or sharing, every contribution Counts! ${
                    PLATFORM_TWITTER_ACCOUNT_ID
                  }`}
                  variant="button"
                />
              </>
            )}

          {isProcessingHooksLoading && (
            <div className="flex h-20 items-center justify-center">
              <Spinner className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
