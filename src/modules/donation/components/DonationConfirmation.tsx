import { useCallback, useState } from "react";

import { Pencil } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { pagoda } from "@/common/api/pagoda";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import {
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
import { TokenIcon, useNearUsdDisplayValue } from "@/modules/core";
import { ProfileLink } from "@/modules/profile";

import { DonationBreakdown } from "./DonationBreakdown";
import { useDonationFees } from "../hooks/fees";
import { DonationInputs } from "../models";

export type DonationConfirmationProps = {
  form: UseFormReturn<DonationInputs>;
};

export const DonationConfirmation: React.FC<DonationConfirmationProps> = ({
  form,
}) => {
  const values = form.watch();
  const [isMessageFieldVisible, setIsMessageFieldVisible] = useState(false);

  const { protocolFeePercent, protocolFeeRecipientAccountId, chefFeePercent } =
    useDonationFees(values);

  const onAddNoteClick = useCallback(() => {
    setIsMessageFieldVisible(true);
    form.setValue("message", "", { shouldDirty: true });
  }, [form]);

  const onDeleteNoteClick = useCallback(() => {
    setIsMessageFieldVisible(false);
    form.resetField("message");
  }, [form]);

  const totalAmount =
    values.potDonationDistribution?.reduce(
      (total, { amount }) => total + amount,
      0.0,
    ) ?? values.amount;

  const { data: selectedTokenMetadata } = pagoda.useTokenMetadata({
    tokenId: values.tokenId,
  });

  const totalNearAmountUsdDisplayValue = useNearUsdDisplayValue(totalAmount);

  const totalAmountUsdDisplayValue =
    values.tokenId === NEAR_TOKEN_DENOM ? totalNearAmountUsdDisplayValue : null;

  console.table(values);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{"Confirm donation"}</DialogTitle>
      </DialogHeader>

      <DialogDescription>
        <div un-flex="~ col" un-gap="1" un-items="start" un-justify="between">
          <span className="prose" un-text="neutral-600" un-font="600">
            Total amount
          </span>

          <div un-flex="~" un-items="center" un-gap="2">
            <TokenIcon tokenId={values.tokenId} />

            <span
              className="prose"
              un-text="xl"
              un-font="600"
            >{`${totalAmount} ${selectedTokenMetadata?.symbol ?? "⋯"}`}</span>

            {totalAmountUsdDisplayValue && (
              <span className="prose" un-text="gray-500 xl">
                {totalAmountUsdDisplayValue}
              </span>
            )}
          </div>
        </div>

        <DonationBreakdown {...{ form }} />

        <div className="flex flex-col gap-2">
          {protocolFeeRecipientAccountId && (
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
                      <ProfileLink accountId={protocolFeeRecipientAccountId} />
                    </>
                  }
                />
              )}
            />
          )}

          {values.potAccountId && (
            <FormField
              control={form.control}
              name="bypassProtocolFee"
              render={({ field }) => (
                <CheckboxField
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  label={
                    <>
                      <span className="prose">{`Remove ${chefFeePercent}% Chef Fees`}</span>

                      {values.potAccountId && (
                        <ProfileLink accountId={values.potAccountId} />
                      )}
                    </>
                  }
                />
              )}
            />
          )}
        </div>

        {values.recipientAccountId && (
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => {
              const isSpecified = typeof field.value === "string";

              return (
                <FormItem className="flex w-full flex-col items-start gap-3 border-t border-t-neutral-200 pt-5">
                  <Button
                    onClick={isSpecified ? onDeleteNoteClick : onAddNoteClick}
                    variant="brand-plain"
                    className={cn("p-0", {
                      "color-neutral-500": !isSpecified,
                      "color-destructive": isSpecified,
                    })}
                    asChild
                  >
                    <FormLabel className="flex justify-center gap-3.5">
                      <Pencil width={14} height={14} />

                      <span un-font="500">{`${isSpecified ? "Delete" : "Add"} Note`}</span>
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