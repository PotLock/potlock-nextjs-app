import { Check } from "lucide-react";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";

import { pagoda } from "@/common/api/pagoda";
import { potlock } from "@/common/api/potlock";
import TwitterSvg from "@/common/assets/svgs/twitter";
import {
  NEAR_DEFAULT_TOKEN_DECIMALS,
  NEAR_TOKEN_DENOM,
} from "@/common/constants";
import { DirectDonation, PotDonation } from "@/common/contracts/potlock";
import { bigStringToFloat, truncate } from "@/common/lib";
import {
  Button,
  ClipboardCopyButton,
  DialogDescription,
  LabeledIcon,
  Skeleton,
} from "@/common/ui/components";
import { ModalErrorBody } from "@/modules/core";
import routesPath from "@/modules/core/routes";
import { TokenTotalValue } from "@/modules/token";

import { DonationSummaryBreakdown } from "./breakdowns";
import { DonationSybilWarning } from "./DonationSybilWarning";
import { useDonationAllocationBreakdown } from "../hooks";
import { DonationInputs, useDonationState } from "../models";

export type DonationSuccessProps = {
  form: UseFormReturn<DonationInputs>;
  transactionHash?: string;
  closeModal: VoidFunction;
};

const staticResultIndicatorClassName =
  "h-12 w-12 rounded-full shadow-[0px_0px_0px_6px_#FEE6E5]";

export const DonationSuccess = ({
  form,
  transactionHash,
  closeModal,
}: DonationSuccessProps) => {
  const { finalOutcome } = useDonationState();
  const isResultLoading = finalOutcome === undefined;
  const [potId] = form.watch(["potAccountId"]);
  const { data: pot } = potlock.usePot({ potId });

  const { data: recipient, error: recipientDataError } = potlock.useAccount({
    accountId:
      "recipient_id" in (finalOutcome ?? {})
        ? (finalOutcome as DirectDonation).recipient_id
        : (finalOutcome as PotDonation).project_id ?? undefined,
  });

  const tokenId =
    "ft_id" in (finalOutcome ?? {})
      ? (finalOutcome as DirectDonation).ft_id
      : NEAR_TOKEN_DENOM;

  const { data: tokenMetadata } = pagoda.useTokenMetadata({ tokenId });

  const isLoading =
    isResultLoading || recipient === undefined || tokenMetadata === undefined;

  const totalAmountFloat = bigStringToFloat(
    finalOutcome?.total_amount ?? "0",
    tokenMetadata?.decimals ?? NEAR_DEFAULT_TOKEN_DECIMALS,
  );

  const protocolFeeAmountFloat = bigStringToFloat(
    finalOutcome?.protocol_fee ?? "0",
    tokenMetadata?.decimals ?? NEAR_DEFAULT_TOKEN_DECIMALS,
  );

  const referralFeeFinalAmountFloat = bigStringToFloat(
    finalOutcome?.referrer_fee ?? "0",
    tokenMetadata?.decimals ?? NEAR_DEFAULT_TOKEN_DECIMALS,
  );

  const breakdown = useDonationAllocationBreakdown({
    pot,
    totalAmountFloat,
    referrerAccountId: finalOutcome?.referrer_id ?? undefined,
    protocolFeeFinalAmount: protocolFeeAmountFloat,
    referralFeeFinalAmount: referralFeeFinalAmountFloat,
  });

  return recipientDataError !== undefined ? (
    <ModalErrorBody
      heading="Donation"
      title="Unable to load recipient data!"
      message={recipientDataError?.message}
    />
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
          <Button
            asChild
            variant="standard-filled"
            className="bg-neutral-950 py-1.5 shadow-none"
          >
            <Link href="#">
              <span className="prose" un-font="500">
                {"Share on"}
              </span>

              <TwitterSvg width={18} height={18} />
            </Link>
          </Button>
        )}
      </div>

      <div un-flex="~ col" un-gap="2" un-items="center">
        {isLoading ? (
          <Skeleton className="h-7 w-44" />
        ) : (
          <TokenTotalValue
            amountBigString={finalOutcome.total_amount}
            {...{ tokenId }}
          />
        )}

        {isLoading ? (
          <Skeleton className="w-49 h-5" />
        ) : (
          <p className="prose" un-m="0" un-flex="~ col">
            <span className="prose flex gap-1">
              <span>{"has been donated to"}</span>

              <span un-font="600">
                {recipient.near_social_profile_data?.name ?? recipient.id}
              </span>
            </span>

            {pot?.name && (
              <span un-text="neutral-600">{`Via ${pot.name} Pot`}</span>
            )}
          </p>
        )}

        {isLoading ? (
          <Skeleton className="w-23.5 h-5" />
        ) : (
          <Link
            href={`${routesPath.PROFILE}/${recipient.id}/funding-raised`}
            onClick={closeModal}
            className="text-red-600"
          >
            {"View donation"}
          </Link>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="h-28" />
      ) : (
        <DonationSummaryBreakdown data={breakdown} {...{ tokenId }} />
      )}

      {potId && <DonationSybilWarning {...{ potId }} />}

      {transactionHash && (
        <LabeledIcon caption={`Txn Hash : ${truncate(transactionHash, 7)}`}>
          <ClipboardCopyButton text={transactionHash} />
        </LabeledIcon>
      )}
    </DialogDescription>
  );
};
