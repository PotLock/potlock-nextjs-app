import { useState } from "react";

import Link from "next/link";

import { campaignsContractHooks } from "@/common/contracts/core";
import { yoctoNearToFloat } from "@/common/lib";
import type { ByCampaignId } from "@/common/types";
import { Skeleton } from "@/common/ui/components";
import { NearIcon } from "@/common/ui/svg";
import { useViewerSession } from "@/common/viewer";
import { AccountProfilePicture } from "@/entities/_shared/account";

import { CampaignForm } from "./CampaignForm";
import { useCampaignCreateOrUpdateRedirect } from "../hooks/redirects";

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

const CampaignSettingsBarCard = ({
  title,
  value,
  hasLogo,
}: {
  title: string;
  value: string;
  hasLogo?: boolean;
}) => {
  return (
    <div className="mb-5 flex w-[50%] flex-col items-start gap-1">
      <p className="text-sm text-[#656565]">{title}</p>
      <h2 className="flex items-center text-[16px] font-semibold">
        {hasLogo && <NearIcon className="mr-1 h-5 w-5" />}
        {value}
      </h2>
    </div>
  );
};

const CampaignSettingsBarCardSkeleton = () => <Skeleton className="w-50% h-5" />;

export type CampaignSettingsProps = ByCampaignId & {};

export const CampaignSettings: React.FC<CampaignSettingsProps> = ({ campaignId }) => {
  const viewer = useViewerSession();
  const [openEditCampaign, setOpenEditCampaign] = useState<boolean>(false);

  const {
    isLoading: isCampaignLoading,
    data: campaign,
    error: campaignLoadingError,
  } = campaignsContractHooks.useCampaign({
    campaignId,
  });

  // TODO: Use skeletons to cover the loading state instead!
  // TODO: Also implement error handling ( when `!isCampaignLoading && campaign === undefined` )
  if (!campaign) return <></>;

  return (
    <div className="w-full md:mx-3 md:w-[70%]">
      <div className="flex w-full flex-col justify-between gap-6 md:flex-row md:items-center md:gap-0">
        <div className="flex flex-wrap items-start justify-between gap-5 md:w-[40%] md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <p className="text-[#7B7B7B]">Organizer</p>

            <Link
              target="_blank"
              href={`/profile/${campaign?.owner}`}
              className="flex items-center gap-2"
            >
              <AccountProfilePicture accountId={campaign?.owner as string} className="h-6 w-6" />
              <p className="font-medium">{campaign?.owner}</p>
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[#7B7B7B]">Recipient</p>

            <Link
              target="_blank"
              href={`/profile/${campaign?.recipient}`}
              className="flex items-center gap-2"
            >
              <AccountProfilePicture
                accountId={campaign?.recipient as string}
                className="h-6 w-6"
              />
              <p className="font-medium">{campaign?.recipient}</p>
            </Link>
          </div>
        </div>

        {viewer.isSignedIn && viewer.accountId === campaign?.owner && (
          <div>
            <p
              onClick={() => setOpenEditCampaign(!openEditCampaign)}
              role="button"
              className="text-red-500"
            >
              Edit Campaign
            </p>
          </div>
        )}
      </div>

      {!openEditCampaign ? (
        <div className="mt-8 w-full rounded-[12px] border border-solid border-[#DBDBDB] p-6">
          <div>
            <h1 className="mb-4 text-xl font-semibold">{campaign?.name}</h1>
            <p className="text-[#292929]">{campaign?.description}</p>
          </div>

          <div className="mt-12 flex w-full flex-wrap items-center justify-between md:w-[80%]">
            <CampaignSettingsBarCard
              title="Funding goal"
              value={`${yoctoNearToFloat(campaign?.target_amount as string)} NEAR`}
              hasLogo
            />

            {campaign ? (
              <CampaignSettingsBarCard
                title="Campaign duration"
                value={`${formatTime(campaign.start_ms)} - ${campaign?.end_ms ? formatTime(campaign.end_ms) : "Ongoing"}`}
              />
            ) : (
              <CampaignSettingsBarCardSkeleton />
            )}

            <CampaignSettingsBarCard
              title="Minimum target"
              value={
                campaign?.min_amount
                  ? `${yoctoNearToFloat(campaign?.min_amount as string)} NEAR`
                  : "N/A"
              }
              hasLogo={!!campaign?.min_amount}
            />

            <CampaignSettingsBarCard
              title="Maximum target"
              value={
                campaign?.max_amount
                  ? `${yoctoNearToFloat(campaign?.max_amount as string)} NEAR`
                  : "N/A"
              }
              hasLogo={!!campaign?.max_amount}
            />
          </div>
        </div>
      ) : (
        <CampaignForm existingData={campaign} />
      )}
    </div>
  );
};
