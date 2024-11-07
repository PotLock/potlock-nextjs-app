import { useState } from "react";

import Link from "next/link";

import { walletApi } from "@/common/api/near";
import { NearIcon } from "@/common/assets/svgs";
import { useRouteQuery, yoctoNearToFloat } from "@/common/lib";
import { AccountProfilePicture } from "@/modules/core";

import { CampaignForm } from "./CampaignForm";
import { useCampaignDeploymentRedirect } from "../hooks/redirects";
import { useCampaign } from "../hooks/useCampaign";

export const CampaignSettings = () => {
  useCampaignDeploymentRedirect();
  const [openEditCampaign, setOpenEditCampaign] = useState<boolean>(false);
  const {
    query: { campaignId },
  } = useRouteQuery();
  const { campaign } = useCampaign({ campaignId: campaignId as string });

  if (!campaign) return <></>;

  const getTime = (timestamp: any) =>
    new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  return (
    <div className="md:mx-3 md:w-[70%] w-full">
      <div className="md:gap-0 md:flex-row md:items-center flex w-full flex-col justify-between gap-6">
        <div className="md:w-[40%] md:flex-row md:items-center flex flex-wrap items-start justify-between gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-[#7B7B7B]">Organizer</p>
            <Link
              target="_blank"
              href={`/profile/${campaign?.owner}`}
              className="flex items-center gap-2"
            >
              <AccountProfilePicture
                accountId={campaign?.owner as string}
                className="h-6 w-6"
              />
              <p className="font-medium">{campaign?.owner}</p>
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[#7B7B7B]">Project</p>
            <Link
              target="_blank"
              href={`/profile/${campaign?.owner}`}
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
        {walletApi.accountId === campaign?.owner && (
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
          <div className="md:w-[80%] mt-12 flex w-full flex-wrap items-center justify-between">
            <BarCard
              title="Funding goal"
              value={`${yoctoNearToFloat(campaign?.target_amount as string)} NEAR`}
              hasLogo
            />
            <BarCard
              title="Campaign duration"
              value={`${getTime(campaign?.start_ms)} - ${campaign?.end_ms ? getTime(campaign?.end_ms) : "Ongoing"}`}
            />
            <BarCard
              title="Minimum target"
              value={
                campaign?.min_amount
                  ? `${yoctoNearToFloat(campaign?.min_amount as string)} NEAR`
                  : "N/A"
              }
              hasLogo={!!campaign?.min_amount}
            />
            <BarCard
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

const BarCard = ({
  title,
  value,
  hasLogo,
}: {
  title: string;
  value: any;
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
