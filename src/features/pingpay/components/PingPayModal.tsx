import { useCallback, useState } from "react";

import { create, useModal } from "@ebay/nice-modal-react";
import { useForm } from "react-hook-form";

import { floatToIndivisible } from "@/common/lib/format";
import { TextField } from "@/common/ui/form/components";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormField,
} from "@/common/ui/layout/components";

export type PingPayModalProps = {
  tokenSymbol: string;
  tokenDecimals: number;
} & (
  | {
      campaignId: string | number;
      campaignName?: string;
      recipientAccountId?: never;
      recipientName?: never;
    }
  | {
      recipientAccountId: string;
      recipientName?: string;
      campaignId?: never;
      campaignName?: never;
    }
);

type PingPayFormValues = {
  amount: number;
};

export const PingPayModal = create((props: PingPayModalProps) => {
  const { tokenSymbol, tokenDecimals } = props;
  const campaignId = "campaignId" in props ? props.campaignId : undefined;
  const campaignName = "campaignName" in props ? props.campaignName : undefined;
  const recipientAccountId =
    "recipientAccountId" in props ? props.recipientAccountId : undefined;
  const recipientName = "recipientName" in props ? props.recipientName : undefined;
  const isCampaign = campaignId !== undefined;

  const self = useModal();

  const form = useForm<PingPayFormValues>({
    mode: "onChange",
    defaultValues: { amount: 0.1 },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = useCallback(() => {
    self.hide();
    self.remove();
  }, [self]);

  const onSubmit = form.handleSubmit(async ({ amount: amountValue }) => {
    const amountFloat = Number(amountValue);

    if (!Number.isFinite(amountFloat) || amountFloat <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const indivisibleAmount = floatToIndivisible(amountFloat, tokenDecimals).toString();

      const endpoint = isCampaign
        ? "/api/pingpay/create-checkout"
        : "/api/pingpay/create-project-checkout";

      const successUrl = isCampaign
        ? `${origin}/campaign/${campaignId}`
        : `${origin}/profile/${recipientAccountId}`;

      const cancelUrl = successUrl;

      const requestBody = isCampaign
        ? {
            amount: indivisibleAmount,
            asset: { chain: "NEAR", symbol: tokenSymbol },
            campaignId,
            successUrl,
            cancelUrl,
          }
        : {
            amount: indivisibleAmount,
            asset: { chain: "NEAR", symbol: tokenSymbol },
            recipientAccountId,
            successUrl,
            cancelUrl,
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      const sessionUrl = data?.session?.sessionUrl ?? data?.sessionUrl;

      if (!res.ok || !sessionUrl) {
        setError(data?.error ?? "Failed to create payment link.");
        return;
      }

      const width = 500;
      const height = 720;
      const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
      const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);

      const features = [
        `width=${width}`,
        `height=${height}`,
        `left=${Math.round(left)}`,
        `top=${Math.round(top)}`,
        "resizable=yes",
        "scrollbars=yes",
        "noopener",
        "noreferrer",
      ].join(",");

      const popup = window.open(sessionUrl, "pingpay-checkout", features);

      if (!popup) {
        setError("Popup blocked. Please allow popups for this site and try again.");
        return;
      }

      popup.focus?.();
      close();
    } catch {
      setError("Failed to create payment link.");
    } finally {
      setIsSubmitting(false);
    }
  });

  const title = isCampaign
    ? campaignName
      ? `Donate to ${campaignName} Campaign`
      : "Create Payment link"
    : recipientName
      ? `Donate to ${recipientName}`
      : "Create Payment link";

  return (
    <Dialog open={self.visible}>
      <DialogContent className="max-w-130" onCloseClick={close}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="flex h-full flex-col">
            <DialogDescription>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <TextField
                    label="Amount"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    onClick={undefined}
                    onBlur={undefined}
                    onFocus={undefined}
                    type="number"
                    placeholder="0.00"
                    min={0}
                    step={0.01}
                    appendix={tokenSymbol}
                  />
                )}
              />

              {error && <p className="text-destructive text-sm">{error}</p>}

              <p className="text-sm text-neutral-600">
                {`You'll be redirected to PingPay to pay with card, wallet, or any supported asset. Funds settle as ${tokenSymbol} to ${
                  isCampaign ? "this campaign" : "this project"
                }.`}
              </p>
            </DialogDescription>

            <DialogFooter>
              <Button
                type="button"
                variant="brand-outline"
                color="black"
                onClick={close}
                disabled={isSubmitting}
              >
                {"Cancel"}
              </Button>

              <Button
                type="submit"
                variant="brand-filled"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Creating…" : "Proceed to pay"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
