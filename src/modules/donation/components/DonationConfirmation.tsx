import { useCallback, useState } from "react";

import { Pencil } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

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
import { cn } from "@/common/ui/utils";
import { useNearUsdDisplayValue } from "@/modules/core";

import { DonationBreakdown } from "./DonationBreakdown";
import { DonationInputs } from "../models";

export type DonationConfirmationProps = {
  form: UseFormReturn<DonationInputs>;
};

export const DonationConfirmation: React.FC<DonationConfirmationProps> = ({
  form,
}) => {
  const values = form.watch();
  const [isMessageFieldVisible, setIsMessageFieldVisible] = useState(false);

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

  const totalNearAmountUsdDisplayValue = useNearUsdDisplayValue(totalAmount);

  const totalAmountUsdDisplayValue =
    values.token === NEAR_TOKEN_DENOM ? totalNearAmountUsdDisplayValue : null;

  console.table(values.token);

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
            <span>{values.token}</span>

            <span
              className="prose"
              un-text="xl"
              un-font="600"
            >{`${totalAmount} ${values.token}`}</span>

            {totalAmountUsdDisplayValue && (
              <span className="prose" un-text="gray-500 xl">
                {totalAmountUsdDisplayValue}
              </span>
            )}
          </div>
        </div>

        <DonationBreakdown {...{ form }} />

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
