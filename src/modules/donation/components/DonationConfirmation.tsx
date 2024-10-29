import { useCallback, useId, useMemo, useState } from "react";

import { Pencil } from "lucide-react";

import { indexer } from "@/common/api/indexer";
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
} from "@/common/ui/components";
import { CheckboxField } from "@/common/ui/form-fields";
import { cn } from "@/common/ui/utils";
import { AccountProfileLink } from "@/modules/account";
import { TokenTotalValue } from "@/modules/token";

import {
  DonationGroupAllocationBreakdown,
  DonationSummaryBreakdown,
} from "./breakdowns";
import { useDonationAllocationBreakdown } from "../hooks";
import { WithDonationFormAPI } from "../models";
import { WithTotalAmount } from "../types";

export type DonationConfirmationProps = WithTotalAmount &
  WithDonationFormAPI & {};

export const DonationConfirmation: React.FC<DonationConfirmationProps> = ({
  form,
  totalAmountFloat,
}) => {
  const detailedBreakdownAccordionId = useId();
  const [isMessageFieldVisible, setIsMessageFieldVisible] = useState(false);

  const [
    tokenId,
    recipientAccountId,
    potAccountId,
    referrerAccountId,
    bypassProtocolFee,
    bypassChefFee,
  ] = form.watch([
    "tokenId",
    "recipientAccountId",
    "potAccountId",
    "referrerAccountId",
    "bypassProtocolFee",
    "bypassChefFee",
  ]);

  const isSingleProjectDonation = typeof recipientAccountId === "string";
  const { data: pot } = indexer.usePot({ potId: potAccountId });

  const breakdown = useDonationAllocationBreakdown({
    pot,
    referrerAccountId,
    bypassProtocolFee,
    bypassChefFee,
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

  const { protocolFeeRecipientAccountId, protocolFeePercent, chefFeePercent } =
    breakdown;

  const totalAmount = useMemo(
    () => (
      <div className="flex flex-col items-start justify-between gap-1">
        <span className="prose font-600 text-neutral-600">
          {"Total amount"}
        </span>

        <TokenTotalValue tokenId={tokenId} amountFloat={totalAmountFloat} />
      </div>
    ),

    [tokenId, totalAmountFloat],
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle>{"Confirm donation"}</DialogTitle>
      </DialogHeader>

      <DialogDescription>
        {isSingleProjectDonation ? (
          totalAmount
        ) : (
          <Accordion collapsible type="single">
            <AccordionItem
              value={detailedBreakdownAccordionId}
              className="border-none"
            >
              <AccordionTrigger className="hover:decoration-none p-0">
                {totalAmount}
              </AccordionTrigger>

              <AccordionContent asChild className="p-0 pt-2">
                <DonationGroupAllocationBreakdown {...{ form }} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        <DonationSummaryBreakdown data={breakdown} {...{ tokenId }} />

        <div className="flex flex-col gap-2">
          {protocolFeePercent > 0 && (
            <FormField
              control={form.control}
              name="bypassProtocolFee"
              render={({ field }) => (
                <CheckboxField
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  label={
                    <>
                      <span className="prose">{`Remove ${protocolFeePercent}% Protocol Fees`}</span>

                      {protocolFeeRecipientAccountId && (
                        <AccountProfileLink
                          accountId={protocolFeeRecipientAccountId}
                        />
                      )}
                    </>
                  }
                />
              )}
            />
          )}

          {potAccountId && chefFeePercent > 0 && (
            <FormField
              control={form.control}
              name="bypassChefFee"
              render={({ field }) => (
                <CheckboxField
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  label={
                    <>
                      <span>{`Remove ${chefFeePercent}% Chef Fees`}</span>

                      {pot?.chef?.id && (
                        <AccountProfileLink accountId={pot?.chef?.id} />
                      )}
                    </>
                  }
                />
              )}
            />
          )}
        </div>

        {isSingleProjectDonation && (
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
                    onClick={
                      isNoteAttached ? onDeleteNoteClick : onAddNoteClick
                    }
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

                  <FormControl
                    className={cn({ hidden: !isMessageFieldVisible })}
                  >
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
