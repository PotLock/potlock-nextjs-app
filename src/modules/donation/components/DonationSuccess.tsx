import { Check, Copy } from "lucide-react";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";

import { pagoda } from "@/common/api/pagoda";
import { potlock } from "@/common/api/potlock";
import TwitterSvg from "@/common/assets/svgs/twitter";
import {
  NEAR_DEFAULT_TOKEN_DECIMALS,
  NEAR_TOKEN_DENOM,
} from "@/common/constants";
import { bigStringToFloat, truncate, yoctoNearToFloat } from "@/common/lib";
import {
  Button,
  ClipboardCopyButton,
  DialogDescription,
  Skeleton,
  TextWithIcon,
} from "@/common/ui/components";
import { ModalErrorBody, TotalTokenValue } from "@/modules/core";

import { DonationBreakdown } from "./DonationBreakdown";
import { useDonationFees } from "../hooks/fees";
import { DonationInputs, DonationState } from "../models";

export type DonationSuccessProps = {
  result?: DonationState["successResult"];
  transactionHashes: string | null;
  form: UseFormReturn<DonationInputs>;
};

export const DonationSuccess = ({
  form,
  result,
  transactionHashes,
}: DonationSuccessProps) => {
  const isResultLoading = result === undefined;
  const [potAccountId] = form.watch(["potAccountId"]);

  const { data: recipientAccount, error: recipientAccountError } =
    potlock.useAccount({
      accountId: result?.recipient_id,
    });

  const { data: tokenMetadata } = pagoda.useTokenMetadata({
    tokenId: result?.ft_id ?? NEAR_TOKEN_DENOM,
  });

  const isLoading =
    isResultLoading ||
    recipientAccount === undefined ||
    tokenMetadata === undefined;

  const totalAmountFloat = bigStringToFloat(
    result?.total_amount ?? "0",
    tokenMetadata?.decimals ?? NEAR_DEFAULT_TOKEN_DECIMALS,
  );

  const fees = useDonationFees({
    amount: totalAmountFloat,
    referrerAccountId: result?.referrer_id ?? undefined,
    potAccountId,
  });

  return recipientAccountError !== undefined ? (
    <ModalErrorBody
      heading="Donation"
      title="Unable to load recipient data!"
      message={recipientAccountError?.message}
    />
  ) : (
    <DialogDescription className="items-center gap-8 p-10">
      <div un-flex="~ col" un-gap="4" un-items="center">
        {isResultLoading ? null : (
          <div
            un-flex="~"
            un-items="center"
            un-justify="center"
            un-border="rounded-full"
            un-shadow="[0px_0px_0px_6px_#FEE6E5]"
            un-w="12"
            un-h="12"
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
            Donation Successful
          </h2>
        )}

        {isResultLoading ? (
          <Skeleton className="w-41 h-4.5" />
        ) : (
          <Button asChild variant="standard-filled" className="bg-neutral-950">
            <Link href="#">
              <span className="prose" un-font="500">
                Share to
              </span>

              <TwitterSvg className="h-4.5 w-4.5" />
            </Link>
          </Button>
        )}
      </div>

      <div un-flex="~ col" un-gap="2" un-items="center">
        {isLoading ? (
          <Skeleton className="h-7 w-44" />
        ) : (
          <TotalTokenValue
            tokenId={result.ft_id}
            amountBigString={result.total_amount}
          />
        )}

        {isLoading ? (
          <Skeleton className="w-49 h-5" />
        ) : (
          <p
            className="prose"
            un-flex="~"
            un-gap="1"
            un-m="0"
            un-text="neutral-950"
          >
            <span>has been donated to</span>

            <span un-font="600">
              {recipientAccount.near_social_profile_data?.name ??
                recipientAccount.id}
            </span>
          </p>
        )}

        {isLoading ? (
          <Skeleton className="w-23.5 h-5" />
        ) : (
          <Link
            href={`/user/${recipientAccount.id}?tab=donations`}
            className="text-red-600"
          >
            View donation
          </Link>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="h-28" />
      ) : (
        <DonationBreakdown tokenId={result.ft_id} {...{ fees }} />
      )}

      {isLoading || transactionHashes === null ? (
        <Skeleton className="w-41 h-5" />
      ) : (
        <TextWithIcon content={`Txn Hash : ${truncate(transactionHashes, 7)}`}>
          <ClipboardCopyButton text={transactionHashes} />
        </TextWithIcon>
      )}
    </DialogDescription>
  );
};
