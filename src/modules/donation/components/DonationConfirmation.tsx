import { useCallback, useState } from "react";

import { Pencil } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { pick } from "remeda";

import { potlock } from "@/common/api/potlock";
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
import { ProfileLink } from "@/modules/profile";
import { TokenTotalValue } from "@/modules/token";

import { DonationSummaryBreakdown } from "./breakdowns";
import { useDonationAllocationBreakdown } from "../hooks";
import { DonationInputs } from "../models";
import { WithTotalAmount } from "../types";

export type DonationConfirmationProps = WithTotalAmount & {
  form: UseFormReturn<DonationInputs>;
};

export const DonationConfirmation: React.FC<DonationConfirmationProps> = ({
  form,
  totalAmountFloat,
}) => {
  const [isMessageFieldVisible, setIsMessageFieldVisible] = useState(false);
  const inputs = form.watch();
  const { data: pot } = potlock.usePot({ potId: inputs.potAccountId });

  const breakdown = useDonationAllocationBreakdown({
    ...pick(inputs, [
      "referrerAccountId",
      "bypassProtocolFee",
      "bypassChefFee",
    ]),

    pot,
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

  return (
    <>
      <DialogHeader>
        <DialogTitle>{"Confirm donation"}</DialogTitle>
      </DialogHeader>

      <DialogDescription>
        <div un-flex="~ col" un-gap="1" un-items="start" un-justify="between">
          <span className="prose" un-text="neutral-600" un-font="600">
            {"Total amount"}
          </span>

          <TokenTotalValue
            tokenId={inputs.tokenId}
            amountFloat={totalAmountFloat}
          />
        </div>

        <DonationSummaryBreakdown tokenId={inputs.tokenId} data={breakdown} />

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
                      <span>{`Remove ${protocolFeePercent}% Protocol Fees`}</span>

                      {protocolFeeRecipientAccountId && (
                        <ProfileLink
                          accountId={protocolFeeRecipientAccountId}
                        />
                      )}
                    </>
                  }
                />
              )}
            />
          )}

          {inputs.potAccountId && chefFeePercent > 0 && (
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
                        <ProfileLink accountId={pot?.chef?.id} />
                      )}
                    </>
                  }
                />
              )}
            />
          )}
        </div>

        {inputs.recipientAccountId && (
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => {
              const isSpecified = typeof field.value === "string";

              return (
                <FormItem
                  className={
                    "flex w-full flex-col items-start gap-3 border-t border-t-neutral-200 pt-5"
                  }
                >
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
