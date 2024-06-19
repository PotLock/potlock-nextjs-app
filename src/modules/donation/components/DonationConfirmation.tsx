import { useCallback, useState } from "react";

import { Pencil } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { potlock } from "@/common/api/potlock";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import {
  Button,
  Checkbox,
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
  allowNotes?: boolean;
  form: UseFormReturn<DonationInputs>;
};

export const DonationConfirmation: React.FC<DonationConfirmationProps> = ({
  allowNotes = false,
  form,
}) => {
  const values = form.watch();
  const [isMessageFieldVisible, setIsMessageFieldVisible] = useState(false);

  const { data: allAccounts } = potlock.useAccounts();

  console.log("allAccounts", allAccounts);

  const { data: potData } = potlock.usePot({
    potId: "africa-public-goods.v1.potfactory.potlock.near",
  });

  console.log("Pot data", potData);

  const onAddNoteClick = useCallback(() => {
    setIsMessageFieldVisible(true);
    form.setValue("message", "", { shouldDirty: true });
  }, [form]);

  const onDeleteNoteClick = useCallback(() => {
    setIsMessageFieldVisible(false);
    form.resetField("message");
  }, [form]);

  const totalNearAmountUsdDisplayValue = useNearUsdDisplayValue(values.amount);

  const totalAmountUsdDisplayValue =
    values.token === NEAR_TOKEN_DENOM ? totalNearAmountUsdDisplayValue : null;

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
            <span>N</span>

            <span
              className="prose"
              un-text="xl"
              un-font="600"
            >{`${values.amount} NEAR`}</span>

            {totalAmountUsdDisplayValue && (
              <span className="prose" un-text="gray-500 xl">
                {totalAmountUsdDisplayValue}
              </span>
            )}
          </div>
        </div>

        <DonationBreakdown data={values} />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Checkbox id="protocol-fees" />

            <label htmlFor="protocol-fees" className="flex items-center gap-2">
              <span>Remove 5% Protocol Fees</span>

              <span className="flex items-center gap-1">
                <span role="img" aria-label="icon">
                  🌐
                </span>

                <span>impact.sputnik.dao.near</span>
              </span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="chef-fees" />

            <label htmlFor="chef-fees" className="flex items-center gap-2">
              <span>Remove 5% Chef Fees</span>

              <span className="flex items-center gap-1">
                <span role="img" aria-label="icon">
                  🌐
                </span>
                <span>#build</span>
              </span>
            </label>
          </div>
        </div>

        {allowNotes && (
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
