import { useMemo } from "react";

import { Big } from "big.js";
import { Check } from "lucide-react";
import Link from "next/link";

import { BLOCKCHAIN_EXPLORER_TX_ENDPOINT_URL } from "@/common/_config";
import { indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_DECIMALS, NATIVE_TOKEN_ID } from "@/common/constants";
import type { DirectDonation } from "@/common/contracts/core/donation";
import type { PotDonation } from "@/common/contracts/core/pot";
import { indivisibleUnitsToFloat, truncate } from "@/common/lib";
import type { AccountId } from "@/common/types";
import {
  ClipboardCopyButton,
  DialogDescription,
  LabeledIcon,
  ModalErrorBody,
  Skeleton,
} from "@/common/ui/layout/components";
import { useWalletUserSession } from "@/common/wallet";
import { AccountProfileLink } from "@/entities/_shared/account";
import { TokenValueSummary, useToken } from "@/entities/_shared/token";
import { rootPathnames } from "@/pathnames";

import { DonationHumanVerificationAlert } from "./human-verification-alert";
import { DonationSummary } from "./summary";
import { useDonationAllocationBreakdown } from "../hooks/breakdowns";
import { WithDonationFormAPI } from "../models/schemas";
import type { GroupDonationReceipts } from "../types";
import { DonationGroupAllocationSuccessXShareButton } from "./group-allocation-success-share";

export type DonationGroupAllocationSuccessScreenProps = WithDonationFormAPI & {
  receipts?: GroupDonationReceipts;
  transactionHash?: string;
  closeModal: VoidFunction;
};

const staticResultIndicatorClassName = "h-12 w-12 rounded-full shadow-[0px_0px_0px_6px_#FEE6E5]";

export const DonationGroupAllocationSuccessScreen: React.FC<
  DonationGroupAllocationSuccessScreenProps
> = ({ form, transactionHash, closeModal, receipts }) => {
  const walletUser = useWalletUserSession();
  const isResultLoading = receipts === undefined;
  const [listId, potId] = form.watch(["listId", "potAccountId"]);
  const isListDonation = listId !== undefined;
  const isPotDonation = potId !== undefined;

  const { data: pot } = indexer.usePot({
    enabled: isPotDonation,
    potId: potId ?? "noop",
  });

  const { data: list } = indexer.useList({
    enabled: isListDonation,
    listId: listId ?? 0,
  });

  const tokenId = useMemo(
    () => NATIVE_TOKEN_ID,

    [],
  );

  const { isLoading: isTokenLoading, data: token } = useToken({ tokenId });

  type DerivedOutcome = {
    recipientAccountIds: AccountId[];
    totalAmountBig: Big;
  };

  const {
    recipientAccountIds,
    totalAmountBig,
    referrerAccountId,
    protocolFeeAmountFloat,
    referralFeeAmountFloat,
  } = useMemo(() => {
    const initialDerivedOutcome = { recipientAccountIds: [], totalAmountBig: Big(0) };

    if (isListDonation) {
      const intermediateDerivedOutcome = (receipts as DirectDonation[])?.reduce<DerivedOutcome>(
        (acc, receipt: DirectDonation) => ({
          recipientAccountIds: [...acc.recipientAccountIds, receipt.recipient_id],

          totalAmountBig: acc.totalAmountBig.plus(
            indivisibleUnitsToFloat(
              receipt.total_amount ?? "0",
              token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
            ),
          ),
        }),

        initialDerivedOutcome,
      );

      return {
        ...intermediateDerivedOutcome,
        referrerAccountId: receipts?.at(0)?.referrer_id ?? undefined,

        protocolFeeAmountFloat: indivisibleUnitsToFloat(
          receipts?.at(0)?.protocol_fee ?? "0",
          token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
        ),

        referralFeeAmountFloat: indivisibleUnitsToFloat(
          receipts?.at(0)?.referrer_fee ?? "0",
          token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
        ),
      };
    } else if (isPotDonation) {
      const intermediateDerivedOutcome = (receipts as PotDonation[])?.reduce<DerivedOutcome>(
        (acc, receipt: PotDonation) => ({
          recipientAccountIds: [...acc.recipientAccountIds, receipt.project_id as AccountId],

          totalAmountBig: acc.totalAmountBig.plus(
            indivisibleUnitsToFloat(
              receipt.total_amount ?? "0",
              token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
            ),
          ),
        }),

        initialDerivedOutcome,
      );

      return {
        ...intermediateDerivedOutcome,
        referrerAccountId: receipts?.at(0)?.referrer_id ?? undefined,

        protocolFeeAmountFloat: indivisibleUnitsToFloat(
          receipts?.at(0)?.protocol_fee ?? "0",
          token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
        ),

        referralFeeAmountFloat: indivisibleUnitsToFloat(
          receipts?.at(0)?.referrer_fee ?? "0",
          token?.metadata.decimals ?? NATIVE_TOKEN_DECIMALS,
        ),
      };
    } else {
      return {
        ...initialDerivedOutcome,
        recipientAccountIds: null,
        referrerAccountId: walletUser.referrerAccountId,
        protocolFeeAmountFloat: 0,
        referralFeeAmountFloat: 0,
      };
    }
  }, [
    isListDonation,
    isPotDonation,
    receipts,
    token?.metadata.decimals,
    walletUser.referrerAccountId,
  ]);

  const allocationBreakdown = useDonationAllocationBreakdown({
    pot,
    totalAmountFloat: totalAmountBig.toNumber(),
    referrerAccountId,
    protocolFeeFinalAmount: protocolFeeAmountFloat,
    referralFeeFinalAmount: referralFeeAmountFloat,
    tokenId,
  });

  const isLoading = isResultLoading || isTokenLoading;

  return !isResultLoading && recipientAccountIds === null ? (
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
          recipientAccountIds !== null && (
            <DonationGroupAllocationSuccessXShareButton {...{ recipientAccountIds }} />
          )
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        {isLoading ? (
          <Skeleton className="h-7 w-44" />
        ) : (
          <TokenValueSummary
            amountFloat={allocationBreakdown.projectAllocationAmount}
            {...{ tokenId }}
          />
        )}

        {isLoading || recipientAccountIds === null ? (
          <Skeleton className="w-49 h-5" />
        ) : (
          <p className="m-0 flex flex-col gap-1">
            <div className="flex gap-1">
              <span className="prose">{"has been donated to"}</span>

              <div className="flex gap-2">
                {recipientAccountIds.map(
                  (
                    recipientAccountId, // TODO: Finish the container limiting the number of displayed accounts
                  ) => (
                    <AccountProfileLink
                      key={recipientAccountId}
                      accountId={recipientAccountId}
                      classNames={{ name: "font-600" }}
                    />
                  ),
                )}
              </div>
            </div>

            {list?.name && (
              <span className="text-center text-neutral-600">{`From ${list.name} List`}</span>
            )}

            {pot?.name && (
              <span className="text-center text-neutral-600">{`Via ${pot.name} Pot`}</span>
            )}
          </p>
        )}

        {isLoading || !walletUser.hasWalletReady || !walletUser.isSignedIn ? (
          <Skeleton className="w-23.5 h-5" />
        ) : (
          <Link
            href={`${rootPathnames.PROFILE}/${walletUser.accountId}/donations`}
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
