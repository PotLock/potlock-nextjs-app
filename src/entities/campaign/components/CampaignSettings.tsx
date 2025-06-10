import { useMemo, useState } from "react";

import Link from "next/link";
import { isNullish } from "remeda";
import { Temporal } from "temporal-polyfill";

import { NATIVE_TOKEN_ID } from "@/common/constants";
import { campaignsContractHooks } from "@/common/contracts/core/campaigns";
import { indivisibleUnitsToFloat } from "@/common/lib";
import type { ByCampaignId } from "@/common/types";
import { Skeleton, Spinner } from "@/common/ui/layout/components";
import { useWalletUserSession } from "@/common/wallet";
import { TokenIcon, useToken } from "@/entities/_shared";
import { AccountProfilePicture } from "@/entities/_shared/account";

import { CampaignForm } from "./CampaignForm";

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

const CampaignSettingsBarCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="mb-5 flex w-[50%] flex-col items-start gap-1">
      <p className="text-sm text-[#656565]">{title}</p>

      <h2 className="flex items-center gap-1 text-[16px] font-semibold">
        {icon}
        <span>{value}</span>
      </h2>
    </div>
  );
};

const CampaignSettingsBarCardSkeleton = () => <Skeleton className="w-50% h-5" />;

export type CampaignSettingsProps = ByCampaignId & {};

export const CampaignSettings: React.FC<CampaignSettingsProps> = ({ campaignId }) => {
  const viewer = useWalletUserSession();
  const [openEditCampaign, setOpenEditCampaign] = useState<boolean>(false);

  const {
    isLoading: isCampaignLoading,
    data: campaign,
    error: campaignLoadingError,
  } = campaignsContractHooks.useCampaign({
    campaignId,
  });

  const { data: token } = useToken({ tokenId: campaign?.ft_id ?? NATIVE_TOKEN_ID });

  const minAmountFLoat = useMemo(
    () =>
      token === undefined || isNullish(campaign?.min_amount)
        ? 0
        : indivisibleUnitsToFloat(campaign.min_amount, token.metadata.decimals),

    [campaign?.min_amount, token],
  );

  const maxAmountFLoat = useMemo(
    () =>
      token === undefined || isNullish(campaign?.max_amount)
        ? 0
        : indivisibleUnitsToFloat(campaign.max_amount, token.metadata.decimals),

    [campaign?.max_amount, token],
  );

  const targetAmountFloat = useMemo(
    () =>
      token === undefined || campaign === undefined
        ? 0
        : indivisibleUnitsToFloat(campaign.target_amount, token.metadata.decimals),

    [campaign, token],
  );

  const tokenIcon = useMemo(
    () => <TokenIcon tokenId={campaign?.ft_id ?? NATIVE_TOKEN_ID} />,
    [campaign?.ft_id],
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
    <div className="w-full md:mx-3 md:w-[80%]">
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
          {viewer.isSignedIn &&
            viewer.accountId === campaign?.owner &&
            (!campaign?.end_ms || Temporal.Now.instant().epochMilliseconds < campaign.end_ms) && (
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
              value={`${targetAmountFloat} ${token?.metadata.symbol ?? ""}`}
              icon={tokenIcon}
            />

            {campaign ? (
              <CampaignSettingsBarCard
                title="Campaign duration"
                value={`${formatTime(
                  campaign.start_ms,
                )} - ${campaign?.end_ms ? formatTime(campaign.end_ms) : "Ongoing"}`}
              />
            ) : (
              <CampaignSettingsBarCardSkeleton />
            )}

            <CampaignSettingsBarCard
              title="Minimum target"
              value={
                minAmountFLoat > 0 ? `${minAmountFLoat} ${token?.metadata.symbol ?? ""}` : "N/A"
              }
              icon={minAmountFLoat > 0 ? tokenIcon : null}
            />

            <CampaignSettingsBarCard
              title="Maximum target"
              value={
                maxAmountFLoat > 0 ? `${maxAmountFLoat} ${token?.metadata.symbol ?? ""}` : "N/A"
              }
              icon={maxAmountFLoat > 0 ? tokenIcon : null}
            />

            <CampaignSettingsBarCard
              title="Referral fee"
              value={`${
                campaign?.referral_fee_basis_points
                  ? `${campaign?.referral_fee_basis_points / 100}%`
                  : "N/A"
              }`}
            />

            <CampaignSettingsBarCard
              title="Protocol fee"
              value={`${
                campaign?.creator_fee_basis_points
                  ? `${campaign?.creator_fee_basis_points / 100}%`
                  : "N/A"
              }`}
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
