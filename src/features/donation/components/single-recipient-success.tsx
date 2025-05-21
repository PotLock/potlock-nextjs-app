import { useMemo } from "react";

import { Check } from "lucide-react";
import Link from "next/link";

import { BLOCKCHAIN_EXPLORER_TX_ENDPOINT_URL } from "@/common/_config";
import { type PotId, indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_DECIMALS, NATIVE_TOKEN_ID } from "@/common/constants";
import { type CampaignDonation, campaignsContractHooks } from "@/common/contracts/core/campaigns";
import type { DirectDonation } from "@/common/contracts/core/donation";
import type { PotDonation } from "@/common/contracts/core/pot";
import { indivisibleUnitsToFloat, truncate } from "@/common/lib";
import {
  ClipboardCopyButton,
  DialogDescription,
  LabeledIcon,
  ModalErrorBody,
  Skeleton,
} from "@/common/ui/layout/components";
import { AccountProfileLink } from "@/entities/_shared/account";
import { TokenValueSummary, useToken } from "@/entities/_shared/token";
import { rootPathnames, routeSelectors } from "@/pathnames";

import { DonationHumanVerificationAlert } from "./human-verification-alert";
import { DonationSingleRecipientSuccessXShareButton } from "./single-recipient-success-share";
import { DonationSummary } from "./summary";
import { useDonationAllocationBreakdown } from "../hooks/breakdowns";
import { WithDonationFormAPI } from "../models/schemas";
import type { SingleRecipientDonationReceipt } from "../types";

export type DonationSingleRecipientSuccessScreenProps = WithDonationFormAPI & {
  receipt?: SingleRecipientDonationReceipt;
  transactionHash?: string;
  closeModal: VoidFunction;
};

const staticResultIndicatorClassName = "h-12 w-12 rounded-full shadow-[0px_0px_0px_6px_#FEE6E5]";

export const DonationSingleRecipientSuccessScreen: React.FC<
  DonationSingleRecipientSuccessScreenProps
> = ({ receipt, form, transactionHash, closeModal }) => {
  const isResultLoading = receipt === undefined;
  const isCampaignDonation = receipt !== undefined && "campaign_id" in receipt;
  const isPotDonation = receipt !== undefined && "matching_pool" in receipt;
  const isDirectDonation = !(isCampaignDonation || isPotDonation);
  const [potId, recipientAccountIdFormValue] = form.watch(["potAccountId", "recipientAccountId"]);

  const campaignReceipt = isCampaignDonation
    ? (receipt as CampaignDonation | undefined)
    : undefined;

  const potReceipt = isPotDonation ? (receipt as PotDonation | undefined) : undefined;
  const directReceipt = isDirectDonation ? (receipt as DirectDonation | undefined) : undefined;

  const recipientAccountId = useMemo(() => {
    if (isCampaignDonation) {
      return campaignReceipt?.recipient_id ?? recipientAccountIdFormValue;
    } else if (isPotDonation) {
      return potReceipt?.project_id ?? recipientAccountIdFormValue;
    } else if (isDirectDonation) {
      return directReceipt?.recipient_id ?? recipientAccountIdFormValue;
    } else return recipientAccountIdFormValue;
  }, [
    campaignReceipt?.recipient_id,
    directReceipt?.recipient_id,
    isCampaignDonation,
    isDirectDonation,
    isPotDonation,
    potReceipt?.project_id,
    recipientAccountIdFormValue,
  ]);

  const { data: campaign, isLoading: isCampaignLoading } = campaignsContractHooks.useCampaign({
    enabled: isCampaignDonation,
    campaignId: isCampaignDonation ? receipt?.campaign_id : 0,
  });

  const { data: pot } = indexer.usePot({
    enabled: potId !== undefined,
    potId: potId as PotId,
  });

  const tokenId = useMemo(() => {
    if (isCampaignDonation || isDirectDonation) {
      return receipt !== undefined
        ? ((receipt as DirectDonation | CampaignDonation).ft_id ?? NATIVE_TOKEN_ID)
        : NATIVE_TOKEN_ID;
    } else return NATIVE_TOKEN_ID;
  }, [isCampaignDonation, isDirectDonation, receipt]);

  const { isLoading: isTokenLoading, data: token } = useToken({ tokenId });

  const isLoading = isResultLoading || isCampaignLoading || isTokenLoading;

  const totalAmountFloat = indivisibleUnitsToFloat(
    receipt?.total_amount ?? "0",
    token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
  );

  const protocolFeeAmountFloat = indivisibleUnitsToFloat(
    receipt?.protocol_fee ?? "0",
    token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
  );

  const referralFeeFinalAmountFloat = indivisibleUnitsToFloat(
    receipt?.referrer_fee ?? "0",
    token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
  );

  const allocationBreakdown = useDonationAllocationBreakdown({
    pot,
    totalAmountFloat,
    referrerAccountId: receipt?.referrer_id ?? undefined,
    protocolFeeFinalAmount: protocolFeeAmountFloat,
    referralFeeFinalAmount: referralFeeFinalAmountFloat,
    tokenId,
  });

  return !isResultLoading && recipientAccountId === undefined ? (
    <ModalErrorBody heading="Donation" title="Unable to load recipient data!" />
  ) : (
    <DialogDescription className="items-center gap-8 p-10">
      <div un-flex="~ col" un-gap="4" un-items="center">
        {isResultLoading ? (
          <Skeleton className={staticResultIndicatorClassName} />
        ) : (
          <div
            className={staticResultIndicatorClassName}
            un-flex="~"
            un-items="center"
            un-justify="center"
            un-p="3"
            un-bg="[var(--primary-600)]"
          >
            <Check className="color-white h-6 w-6" />
          </div>
        )}

        {isResultLoading ? (
          <Skeleton className="w-46 h-7" />
        ) : (
          <h2 className="prose" un-text="xl" un-font="600">
            {"Donation Successful"}
          </h2>
        )}

        {isResultLoading ? (
          <Skeleton className="w-41 h-4.5" />
        ) : (
          recipientAccountId && (
            <DonationSingleRecipientSuccessXShareButton {...{ recipientAccountId }} />
          )
        )}
      </div>

      <div un-flex="~ col" un-gap="2" un-items="center">
        {isLoading ? (
          <Skeleton className="h-7 w-44" />
        ) : (
          <TokenValueSummary
            amountFloat={allocationBreakdown.projectAllocationAmount}
            {...{ tokenId }}
          />
        )}

        {isLoading || recipientAccountId === undefined ? (
          <Skeleton className="w-49 h-5" />
        ) : (
          <p className="m-0 flex flex-col items-center gap-1">
            <div className="flex gap-1">
              <span className="prose">{"has been donated to"}</span>

              <AccountProfileLink
                accountId={recipientAccountId}
                classNames={{ name: "font-600" }}
              />
            </div>

            {campaign?.name && (
              <Link href={routeSelectors.CAMPAIGN_BY_ID(campaign.id)}>
                <span className="text-center text-neutral-600">{`Via ${campaign.name} Campaign`}</span>
              </Link>
            )}

            {pot?.name && (
              <span className="text-center text-neutral-600">{`Via ${pot.name} Pot`}</span>
            )}
          </p>
        )}

        {isLoading || recipientAccountId === undefined ? (
          <Skeleton className="w-23.5 h-5" />
        ) : (
          <Link
            href={`${rootPathnames.PROFILE}/${recipientAccountId}/funding-raised`}
            onClick={closeModal}
            className="font-500 text-red-600"
          >
            {"View donation"}
          </Link>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="h-28" />
      ) : (
        <DonationSummary data={allocationBreakdown} {...{ tokenId }} />
      )}

      {potId && <DonationHumanVerificationAlert {...{ potId }} />}

      {transactionHash && (
        <LabeledIcon
          caption={`Transaction Hash : ${truncate(transactionHash, 10)}`}
          hint="View on blockchain explorer"
          href={`${BLOCKCHAIN_EXPLORER_TX_ENDPOINT_URL}/${transactionHash}`}
        >
          <ClipboardCopyButton text={transactionHash} />
        </LabeledIcon>
      )}
    </DialogDescription>
  );
};
