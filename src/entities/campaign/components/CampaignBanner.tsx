import { useMemo } from "react";

import { BadgeCheck, CircleAlert } from "lucide-react";
import { isNonNullish, isNullish } from "remeda";
import { Temporal } from "temporal-polyfill";

import { PLATFORM_NAME } from "@/common/_config";
import { Campaign, V1CampaignsRetrieveStatus, indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_DECIMALS, NATIVE_TOKEN_ID, PLATFORM_TWITTER_ACCOUNT_ID } from "@/common/constants";
import { campaignsContractHooks } from "@/common/contracts/core/campaigns";
import { Campaign as ContractCampaign } from "@/common/contracts/core/campaigns/interfaces";
import { indivisibleUnitsToFloat } from "@/common/lib";
import { toTimestamp } from "@/common/lib/datetime";
import getTimePassed from "@/common/lib/getTimePassed";
import type { ByCampaignId } from "@/common/types";
import { Button, SocialsShare, Spinner } from "@/common/ui/layout/components";
import { LazyImage } from "@/common/ui/layout/components/LazyImage";
import { BadgeIcon } from "@/common/ui/layout/svg/BadgeIcon";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import { AccountProfileLink } from "@/entities/_shared/account";
import { useFungibleToken } from "@/entities/_shared/token";
import { DonateToCampaign } from "@/features/donation";

import { CampaignProgressBar } from "./CampaignProgressBar";
import { useCampaignForm } from "../hooks/forms";

/**
 * Maps a campaign fetched directly from the contract (RPC) to the indexer format.
 * Used when indexer hasn't caught up yet (e.g., immediately after campaign creation).
 */
const mapContractCampaignToIndexerFormat = (contractCampaign: ContractCampaign): Campaign => {
  const msToIsoString = (ms: number | null | undefined): string | null => {
    if (!ms) return null;
    return new Date(ms).toISOString();
  };

  const now = Date.now();
  let status = "active";
  if (contractCampaign.start_ms > now) {
    status = "pending";
  } else if (contractCampaign.end_ms && contractCampaign.end_ms < now) {
    status = "completed";
  }

  return {
    on_chain_id: contractCampaign.id,
    name: contractCampaign.name,
    description: contractCampaign.description || null,
    cover_image_url: contractCampaign.cover_image_url || null,
    created_at: new Date().toISOString(),
    start_at: msToIsoString(contractCampaign.start_ms) ?? new Date().toISOString(),
    end_at: msToIsoString(contractCampaign.end_ms ?? null),
    owner: {
      id: contractCampaign.owner,
      donors_count: 0,
      total_donations_in_usd: 0,
      total_donations_out_usd: 0,
      total_matching_pool_allocations_usd: 0,
    },
    recipient: {
      id: contractCampaign.recipient,
      donors_count: 0,
      total_donations_in_usd: 0,
      total_donations_out_usd: 0,
      total_matching_pool_allocations_usd: 0,
    },
    token: {
      account: contractCampaign.ft_id ?? NATIVE_TOKEN_ID,
      decimals: NATIVE_TOKEN_DECIMALS,
      name: contractCampaign.ft_id ?? "NEAR",
      symbol: contractCampaign.ft_id?.toUpperCase() ?? "NEAR",
    },
    target_amount: contractCampaign.target_amount,
    min_amount: contractCampaign.min_amount ?? null,
    max_amount: contractCampaign.max_amount ?? null,
    escrow_balance: contractCampaign.escrow_balance,
    net_raised_amount: contractCampaign.total_raised_amount ?? "0",
    total_raised_amount: contractCampaign.total_raised_amount ?? "0",
    referral_fee_basis_points: contractCampaign.referral_fee_basis_points ?? 0,
    creator_fee_basis_points: contractCampaign.creator_fee_basis_points ?? 0,
    allow_fee_avoidance: contractCampaign.allow_fee_avoidance ?? false,
    status,
    target_amount_usd: null,
    min_amount_usd: null,
    max_amount_usd: null,
    escrow_balance_usd: null,
    net_raised_amount_usd: null,
    total_raised_amount_usd: null,
  };
};

export type CampaignBannerProps = ByCampaignId & {};

export const CampaignBanner: React.FC<CampaignBannerProps> = ({ campaignId }) => {
  const viewer = useWalletUserSession();

  // Primary: Try to fetch from indexer (Django backend)
  const {
    data: indexerCampaign,
    isLoading: isIndexerLoading,
    isValidating: isCampaignValidating,
    error: indexerError,
  } = indexer.useCampaign({ campaignId });

  // Fallback: Fetch directly from contract via RPC when indexer fails
  // This handles the case when a campaign was just created but not yet indexed
  const shouldFetchFromContract = !!indexerError && !indexerCampaign && !isIndexerLoading;

  const { data: contractCampaign, isLoading: isContractLoading } =
    campaignsContractHooks.useCampaign({
      campaignId,
      enabled: shouldFetchFromContract,
    });

  // Map contract data to indexer format if using fallback
  const campaign = useMemo(() => {
    if (indexerCampaign) return indexerCampaign;
    if (contractCampaign) return mapContractCampaignToIndexerFormat(contractCampaign);
    return undefined;
  }, [indexerCampaign, contractCampaign]);

  const isCampaignLoading = isIndexerLoading || (shouldFetchFromContract && isContractLoading);
  const campaignLoadingError = indexerError && !contractCampaign ? indexerError : undefined;

  const { data: token } = useFungibleToken({ tokenId: campaign?.token.account ?? NATIVE_TOKEN_ID });

  const raisedAmountFloat = useMemo(
    () =>
      token === undefined || campaign === undefined
        ? 0
        : indivisibleUnitsToFloat(campaign?.net_raised_amount ?? "0", token.metadata.decimals),

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

  // Show loading state while retrying (handles race condition when campaign is just created but not yet indexed)
  if (campaignLoadingError && isCampaignValidating) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-2">
        <Spinner className="h-7 w-7" />
        <p className="text-sm text-gray-500">Loading campaign...</p>
      </div>
    );
  }

  // Only show error after retries are exhausted
  if (campaignLoadingError && !isCampaignValidating) {
    return <h1>Error Loading Campaign</h1>;
  }

  const isStarted = getTimePassed(toTimestamp(campaign?.start_at ?? 0), true)?.includes("-");

  const isEnded = campaign?.end_at
    ? getTimePassed(toTimestamp(campaign?.end_at), false, true)?.includes("-")
    : false;

  // Check if the hooks are still loading
  const isProcessingHooksLoading =
    isHasEscrowedDonationsLoading || isDonationRefundsProcessedLoading;

  return isCampaignLoading ? (
    <div className="flex h-40 items-center justify-center">
      <Spinner className="h-7 w-7" />
    </div>
  ) : (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:gap-0">
        <div className="w-full rounded-xl  border border-gray-300 md:w-[70%]">
        <div className="relative">
          <LazyImage
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
                    accountId={campaign?.recipient?.id ?? ""}
                  />
                </div>

                <div className="hidden flex-col items-center bg-gray-800 md:flex">
                  <span className="bg-background h-[18px] w-[2px] text-white" />{" "}
                </div>

                <div className="flex gap-1">
                  <span className="font-semibold">ORGANIZED BY</span>
                  <AccountProfileLink accountId={campaign?.owner?.id ?? ""} />
                </div>
              </div>

              {campaign?.owner?.id === campaign?.recipient?.id && (
                <div className="flex items-center gap-1">
                  <BadgeIcon size={5} />
                  <span className="m-0 font-bold">OFFICIAL</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="prose prose-sm max-w-none p-4"
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
          tokenId={campaign?.token.account ?? NATIVE_TOKEN_ID}
          amount={campaign?.net_raised_amount ?? `${0}`}
          status={campaign?.status as V1CampaignsRetrieveStatus}
          minAmount={campaign?.min_amount ?? `${0}`}
          target={campaign?.target_amount ?? `${0}`}
          startDate={toTimestamp(campaign?.start_at ?? 0)}
          isEscrowBalanceEmpty={campaign?.escrow_balance === "0"}
          endDate={toTimestamp(campaign?.end_at ?? 0)}
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
            campaign?.end_at &&
            toTimestamp(campaign?.end_at ?? 0) < Temporal.Now.instant().epochMilliseconds &&
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
              !campaign?.end_at ||
              toTimestamp(campaign?.end_at ?? 0) >= Temporal.Now.instant().epochMilliseconds ||
              raisedAmountFloat >= minAmountFloat) && (
              <>
                <DonateToCampaign
                  cachedTokenId={campaign?.token.account ?? NATIVE_TOKEN_ID}
                  disabled={campaign?.status !== "active"}
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
    </div>
  );
};
