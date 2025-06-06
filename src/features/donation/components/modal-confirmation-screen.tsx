import { useCallback, useId, useMemo, useState } from "react";

import { Pencil } from "lucide-react";

import { indexer } from "@/common/api/indexer";
import { NOOP_STRING } from "@/common/constants";
import { campaignsContractHooks } from "@/common/contracts/core/campaigns";
import type { CampaignId } from "@/common/types";
import { CheckboxField } from "@/common/ui/form/components";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Textarea,
} from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import { AccountProfileLink } from "@/entities/_shared/account";
import { TokenValueSummary } from "@/entities/_shared/token";

import { DonationSummary } from "./summary";
import { useDonationAllocationBreakdown } from "../hooks/allocation";
import { WithDonationFormAPI } from "../models/schemas";
import { DonationAllocationStrategyEnum, WithTotalAmount } from "../types";
import { DonationGroupAllocationBreakdown } from "./group-allocation-breakdown";

export type DonationModalConfirmationScreenProps = WithTotalAmount &
  WithDonationFormAPI & {
    /**
     * `null` for non-campaign donations, otherwise the campaign ID
     */
    campaignId: null | CampaignId;
  };

export const DonationModalConfirmationScreen: React.FC<DonationModalConfirmationScreenProps> = ({
  form,
  totalAmountFloat,
  campaignId,
}) => {
  const walletUser = useWalletUserSession();
  const detailedBreakdownAccordionId = useId();
  const [isMessageFieldVisible, setIsMessageFieldVisible] = useState(false);

  const [
    tokenId,
    potAccountId,
    bypassProtocolFee,
    bypassReferralFee,
    bypassCuratorFee,
    allocationStrategy,
  ] = form.watch([
    "tokenId",
    "potAccountId",
    "bypassProtocolFee",
    "bypassReferralFee",
    "bypassCuratorFee",
    "allocationStrategy",
  ]);

  const isSingleRecipientDonation = allocationStrategy === DonationAllocationStrategyEnum.full;
  const isCampaignDonation = campaignId !== null;
  const isPotDonation = potAccountId !== undefined;

  const { data: campaign } = campaignsContractHooks.useCampaign({
    enabled: isCampaignDonation,
    campaignId: isCampaignDonation ? campaignId : 0,
  });

  const { data: pot } = indexer.usePot({
    enabled: isPotDonation,
    potId: potAccountId ?? NOOP_STRING,
  });

  const isFeeBypassAllowed = useMemo(
    () => (isCampaignDonation ? (campaign?.allow_fee_avoidance ?? false) : true),
    [campaign?.allow_fee_avoidance, isCampaignDonation],
  );

  const allocationBreakdown = useDonationAllocationBreakdown({
    campaign,
    potCache: pot,
    referrerAccountId: walletUser.referrerAccountId,
    bypassProtocolFee,
    bypassReferralFee,
    bypassCuratorFee,
    totalAmountFloat,
  });

  const onAddNoteClick = useCallback(() => {
    setIsMessageFieldVisible(true);
    form.setValue("message", "", { shouldDirty: true });
  }, [form]);

  const onDeleteNoteClick = useCallback(() => {
    setIsMessageFieldVisible(false);
    form.resetField("message");
  }, [form]);

  const totalAmount = useMemo(
    () => (
      <div className="flex flex-col items-start justify-between gap-1">
        <span className="prose font-600 text-neutral-600">{"Total amount"}</span>
        <TokenValueSummary tokenId={tokenId} amountFloat={totalAmountFloat} />
      </div>
    ),

    [tokenId, totalAmountFloat],
  );

  const { protocolFee, referralFee, curatorFee, curatorTitle } = allocationBreakdown;

  return (
    <>
      <DialogHeader>
        <DialogTitle>{"Confirm donation"}</DialogTitle>
      </DialogHeader>

      <DialogDescription>
        {isSingleRecipientDonation ? (
          totalAmount
        ) : (
          <Accordion collapsible type="single">
            <AccordionItem value={detailedBreakdownAccordionId} className="border-none">
              <AccordionTrigger className="hover:decoration-none p-0">
                {totalAmount}
              </AccordionTrigger>

              <AccordionContent asChild className="p-0 pt-2">
                <DonationGroupAllocationBreakdown {...{ form }} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        <DonationSummary allocation={allocationBreakdown} {...{ tokenId }} />

        <div className="flex flex-col gap-2">
          {isFeeBypassAllowed && protocolFee.percentage > 0 && (
            <FormField
              control={form.control}
              name="bypassProtocolFee"
              render={({ field }) => (
                <CheckboxField
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  label={
                    <>
                      <span className="prose">
                        {`Remove ${protocolFee.percentage}% Protocol Fee`}
                      </span>

                      {protocolFee.recipientAccountId && (
                        <AccountProfileLink accountId={protocolFee.recipientAccountId} />
                      )}
                    </>
                  }
                />
              )}
            />
          )}

          {isFeeBypassAllowed && referralFee.percentage > 0 && (
            <FormField
              control={form.control}
              name="bypassReferralFee"
              render={({ field }) => (
                <CheckboxField
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  label={
                    <>
                      <span className="prose">
                        {`Remove ${referralFee.percentage}% Referrer Fee`}
                      </span>

                      {referralFee.recipientAccountId && (
                        <AccountProfileLink accountId={referralFee.recipientAccountId} />
                      )}
                    </>
                  }
                />
              )}
            />
          )}

          {isFeeBypassAllowed &&
            (isCampaignDonation || isPotDonation) &&
            curatorFee.percentage > 0 && (
              <FormField
                control={form.control}
                name="bypassCuratorFee"
                render={({ field }) => (
                  <CheckboxField
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label={
                      <>
                        <span>{`Remove ${curatorFee.percentage}% ${curatorTitle} Fee`}</span>

                        {curatorFee.recipientAccountId && (
                          <AccountProfileLink accountId={curatorFee.recipientAccountId} />
                        )}
                      </>
                    }
                  />
                )}
              />
            )}
        </div>

        {isSingleRecipientDonation && (
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => {
              const isNoteAttached = typeof field.value === "string";

              return (
                <FormItem
                  className={
                    "flex w-full flex-col items-start gap-3 border-t border-t-neutral-200 pt-5"
                  }
                >
                  <Button
                    asChild
                    onClick={isNoteAttached ? onDeleteNoteClick : onAddNoteClick}
                    variant="brand-plain"
                    className={cn("p-0", {
                      "color-neutral-500": !isNoteAttached,
                      "color-destructive": isNoteAttached,
                    })}
                  >
                    <FormLabel className="flex justify-center gap-3.5">
                      <Pencil width={14} height={14} />
                      <span un-font="500">{`${isNoteAttached ? "Delete" : "Add"} Note`}</span>
                    </FormLabel>
                  </Button>

                  <FormControl className={cn({ hidden: !isMessageFieldVisible })}>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                </FormItem>
              );
            }}
          />
        )}
      </DialogDescription>
    </>
  );
};
