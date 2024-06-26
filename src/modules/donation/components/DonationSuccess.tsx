import { Check, Copy } from "lucide-react";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";

import { potlock } from "@/common/api/potlock";
import TwitterSvg from "@/common/assets/svgs/twitter";
import { yoctoNearToFloat } from "@/common/lib";
import { Button, DialogDescription, Skeleton } from "@/common/ui/components";
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
  const [potAccountId] = form.watch(["potAccountId"]);
  const totalAmountFloat = yoctoNearToFloat(result?.total_amount ?? "0");

  console.log(transactionHashes);

  const { data: account, error: accountError } = potlock.useAccount({
    accountId: result?.recipient_id,
  });

  const isLoading = result === undefined || account === undefined;

  // !TODO: override with values from result
  const fees = useDonationFees({
    amount: totalAmountFloat,
    referrerAccountId: result?.referrer_id ?? undefined,
    potAccountId,
    bypassProtocolFee: result?.protocol_fee === 0,
    bypassChefFee: potAccountId !== undefined,
  });

  return accountError !== undefined ? (
    <ModalErrorBody
      heading="Donation"
      title="Unable to load recipient data!"
      message={accountError?.message}
    />
  ) : (
    <DialogDescription className="items-center gap-8 p-10">
      <div un-flex="~ col" un-gap="4" un-items="center">
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

        {isLoading ? (
          <Skeleton className="w-46 h-7" />
        ) : (
          <h2 className="prose" un-text="xl" un-font="600">
            Donation Successful
          </h2>
        )}

        {isLoading ? (
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
            <span un-font="600">{result?.recipient_id}</span>
          </p>
        )}

        <Link href="#" className="text-red-600">
          View donation
        </Link>
      </div>

      {isLoading ? (
        <Skeleton className="h-28" />
      ) : (
        <DonationBreakdown tokenId={result.ft_id} {...{ fees }} />
      )}

      {isLoading || transactionHashes === null ? (
        <Skeleton className="w-41 h-5" />
      ) : (
        <div un-flex="~" un-items="center" un-gap="2">
          <span>{`Txn Hash : ${transactionHashes}`}</span>
          <Copy className="h-4 w-4" />
        </div>
      )}
    </DialogDescription>
  );
};
