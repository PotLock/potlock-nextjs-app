import { useState } from "react";

import Link from "next/link";
import { Temporal } from "temporal-polyfill";

import { campaignsContractHooks } from "@/common/contracts/core/campaigns";
import { yoctoNearToFloat } from "@/common/lib";
import type { ByCampaignId } from "@/common/types";
import { Button, Skeleton, Spinner } from "@/common/ui/layout/components";
import { NearIcon } from "@/common/ui/layout/svg";
import { useWalletUserSession } from "@/common/wallet";
import { AccountProfilePicture } from "@/entities/_shared/account";

import { CampaignForm } from "./CampaignForm";
import { useCampaignForm } from "../hooks/forms";

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
  const viewer = useWalletUserSession();
  const [openEditCampaign, setOpenEditCampaign] = useState<boolean>(false);

  const { handleProcessEscrowedDonations, handleDonationsRefund } = useCampaignForm({ campaignId });

  const {
    isLoading: isCampaignLoading,
    data: campaign,
    error: campaignLoadingError,
  } = campaignsContractHooks.useCampaign({
    campaignId,
  });

  const { data: hasEscrowedDonations } = campaignsContractHooks.useHasEscrowedDonationsToProcess({
    campaignId,
    enabled:
      !!campaign?.min_amount &&
      Number(campaign?.total_raised_amount) >= Number(campaign?.min_amount),
  });

  const { data: isDonationRefundsProcessed } = campaignsContractHooks.useIsDonationRefundsProcessed(
    {
      campaignId,
      enabled:
        !!campaign?.end_ms &&
        campaign?.end_ms < Temporal.Now.instant().epochMilliseconds &&
        Number(campaign?.total_raised_amount) < Number(campaign?.min_amount),
    },
  );

  if (campaignLoadingError)
    return (
      <div className="flex w-full flex-col items-center justify-center">
        <h1>This Campaign does not Exist</h1>
      </div>
    );

  return isCampaignLoading ? (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <Spinner className="h-20 w-20" />
    </div>
  ) : (
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
        <div className="flex flex-col-reverse gap-2 md:items-center md:gap-4">
          {viewer.isSignedIn && hasEscrowedDonations && (
            <Button variant="brand-outline" onClick={handleProcessEscrowedDonations}>
              Process Donation
            </Button>
          )}

          {viewer.isSignedIn &&
            isDonationRefundsProcessed &&
            campaign?.end_ms &&
            campaign?.end_ms < Temporal.Now.instant().epochMilliseconds &&
            Number(campaign?.total_raised_amount) < Number(campaign?.min_amount) && (
              <Button variant="brand-outline" onClick={handleDonationsRefund}>
                Process Donations Refund
              </Button>
            )}

          {viewer.isSignedIn && viewer.accountId === campaign?.owner && (
            <div>
              <p
                onClick={() => setOpenEditCampaign(!openEditCampaign)}
                role="button"
                className="text-red-500"
              >
                {openEditCampaign ? "Show Campaign Details" : "Edit Campaign"}
              </p>
            </div>
          )}
        </div>
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
        <CampaignForm
          existingData={campaign}
          closeEditCampaign={() => setOpenEditCampaign(false)}
          campaignId={campaignId}
        />
      )}
    </div>
  );
};
