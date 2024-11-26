import { useMemo } from "react";

import { Check } from "lucide-react";
import Link from "next/link";

import { BLOCKCHAIN_EXPLORER_TX_ENDPOINT_URL } from "@/common/_config";
import { indexer } from "@/common/api/indexer";
import TwitterSvg from "@/common/assets/svgs/twitter";
import { NATIVE_TOKEN_DECIMALS, NATIVE_TOKEN_ID } from "@/common/constants";
import { DirectDonation, PotDonation } from "@/common/contracts/core";
import { bigStringToFloat, truncate } from "@/common/lib";
import { ftService } from "@/common/services";
import {
  Button,
  ClipboardCopyButton,
  DialogDescription,
  LabeledIcon,
  Skeleton,
} from "@/common/ui/components";
import { AccountProfileLink } from "@/modules/account";
import { ModalErrorBody } from "@/modules/core";
import routesPath from "@/modules/core/routes";
import { TokenTotalValue } from "@/modules/token";

import {
  DEFAULT_SHARE_HASHTAGS,
  POTLOCK_TWITTER_ACCOUNT_ID,
} from "../constants";
import { DonationSummaryBreakdown } from "./breakdowns";
import { DonationSybilWarning } from "./DonationSybilWarning";
import { useDonationAllocationBreakdown } from "../hooks";
import { WithDonationFormAPI, useDonationState } from "../models";

export type DonationSuccessProps = WithDonationFormAPI & {
  transactionHash?: string;
  closeModal: VoidFunction;
};

const staticResultIndicatorClassName = "h-12 w-12 rounded-full shadow-[0px_0px_0px_6px_#FEE6E5]";

export const DonationSuccess = ({ form, transactionHash, closeModal }: DonationSuccessProps) => {
  const { finalOutcome } = useDonationState();
  const isResultLoading = finalOutcome === undefined;
  const [potId] = form.watch(["potAccountId"]);
  const { data: pot } = indexer.usePot({ potId });

  const { data: recipient, error: recipientDataError } = indexer.useAccount({
    accountId:
      "recipient_id" in (finalOutcome ?? {})
        ? (finalOutcome as DirectDonation).recipient_id
        : ((finalOutcome as PotDonation).project_id ?? undefined),
  });

  const tokenId =
    "ft_id" in (finalOutcome ?? {}) ? (finalOutcome as DirectDonation).ft_id : NATIVE_TOKEN_ID;

  const { data: token } = ftService.useRegisteredToken({ tokenId });

  const isLoading = isResultLoading || recipient === undefined || token === undefined;

  const totalAmountFloat = bigStringToFloat(
    finalOutcome?.total_amount ?? "0",
    token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
  );

  const protocolFeeAmountFloat = bigStringToFloat(
    finalOutcome?.protocol_fee ?? "0",
    token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
  );

  const referralFeeFinalAmountFloat = bigStringToFloat(
    finalOutcome?.referrer_fee ?? "0",
    token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
  );

  const breakdown = useDonationAllocationBreakdown({
    pot,
    totalAmountFloat,
    referrerAccountId: finalOutcome?.referrer_id ?? undefined,
    protocolFeeFinalAmount: protocolFeeAmountFloat,
    referralFeeFinalAmount: referralFeeFinalAmountFloat,
  });

  const twitterIntent = useMemo(() => {
    if (!recipient?.near_social_profile_data) return;
    const twitterIntentBase = "https://twitter.com/intent/tweet?text=";

    const profile: any = recipient?.near_social_profile_data;
    const singlePorject = profile
      ? profile.linktree?.twitter
        ? `@${profile.linktree.twitter}`
        : profile.name
      : recipient.id;

    const tag = `${singlePorject}`;

    let url = `https://alpha.potlock.io${routesPath.PROFILE}/${recipient.id}/funding-raised`;
    let text = `I just donated to ${tag} on @${POTLOCK_TWITTER_ACCOUNT_ID}! Support public goods at `;
    text = encodeURIComponent(text);
    url = encodeURIComponent(url);
    return (
      twitterIntentBase +
      text +
      `&url=${url}` +
      `&hashtags=${DEFAULT_SHARE_HASHTAGS.join(",")}`
    );
  }, [recipient?.id, recipient?.near_social_profile_data]);

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
          <Button asChild variant="standard-filled" className="bg-neutral-950 py-1.5 shadow-none">
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
          <TokenTotalValue amountBigString={finalOutcome.total_amount} {...{ tokenId }} />
        )}

        {isLoading ? (
          <Skeleton className="w-49 h-5" />
        ) : (
          <p className="m-0 flex flex-col">
            <div className="flex gap-1">
              <span className="prose">{"has been donated to"}</span>

              <AccountProfileLink accountId={recipient.id} classNames={{ name: "font-600" }} />
            </div>

            {pot?.name && (
              <span className="text-center text-neutral-600">{`Via ${pot.name} Pot`}</span>
            )}
          </p>
        )}

        {isLoading ? (
          <Skeleton className="w-23.5 h-5" />
        ) : (
          <Link
            href={`${routesPath.PROFILE}/${recipient.id}/funding-raised`}
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
        <DonationSummaryBreakdown data={breakdown} {...{ tokenId }} />
      )}

      {potId && <DonationSybilWarning {...{ potId }} />}

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
