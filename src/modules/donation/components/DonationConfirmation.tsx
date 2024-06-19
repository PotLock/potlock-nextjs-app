import { Pencil } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { NEAR_TOKEN_DENOM } from "@/common/constants";
import {
  Checkbox,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@/common/ui/components";
import { useNearUsdDisplayValue } from "@/modules/core";

import { DonationBreakdown } from "./DonationBreakdown";
import { DonationInputs } from "../models";

export type DonationConfirmationProps = {
  form: UseFormReturn<DonationInputs>;
};

export const DonationConfirmation = ({ form }: DonationConfirmationProps) => {
  const values = form.watch();

  const totalNearAmountUsdDisplayValue = useNearUsdDisplayValue(values.amount);

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

        {values.allocationStrategy === "direct" ||
          (values.potDistributionStrategy === "manually" && (
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col items-start gap-3 border-t border-t-neutral-200 pt-5">
                  <FormLabel className="flex justify-center gap-3.5">
                    <Pencil className="color-neutral-500 h-3.5 w-3.5" />
                    <span un-font="500">Add Note</span>
                  </FormLabel>

                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
      </DialogDescription>
    </>
  );
};
