import { useCallback, useState } from "react";

import { create, useModal } from "@ebay/nice-modal-react";
import { Check, Copy, ExternalLink } from "lucide-react";
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
import { useWalletUserSession } from "@/common/wallet";

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

  const recipientAccountId = "recipientAccountId" in props ? props.recipientAccountId : undefined;

  const recipientName = "recipientName" in props ? props.recipientName : undefined;
  const isCampaign = campaignId !== undefined;

  const self = useModal();
  const walletUser = useWalletUserSession();

  const donorAccountId =
    walletUser.isSignedIn && walletUser.accountId ? walletUser.accountId : null;

  const form = useForm<PingPayFormValues>({
    mode: "onChange",
    defaultValues: { amount: 0.1 },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionUrl, setSessionUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const close = useCallback(() => {
    self.hide();
    self.remove();
  }, [self]);

  const handleCopy = useCallback(() => {
    if (!sessionUrl) return;

    navigator.clipboard.writeText(sessionUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [sessionUrl]);

  const handlePayNow = useCallback(() => {
    if (!sessionUrl) return;
    window.open(sessionUrl, "_blank", "noopener,noreferrer");
    close();
  }, [sessionUrl, close]);

  const onSubmit = form.handleSubmit(async ({ amount: amountValue }) => {
    const amountFloat = Number(amountValue);

    if (!Number.isFinite(amountFloat) || amountFloat <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    if (!donorAccountId) {
      setError("Please connect your NEAR wallet before creating a payment link.");
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
        ? `${origin}/pingpay/callback?type=campaign&id=${campaignId}&status=success`
        : `${origin}/pingpay/callback?type=project&id=${encodeURIComponent(recipientAccountId ?? "")}&status=success`;

      const cancelUrl = isCampaign
        ? `${origin}/pingpay/callback?type=campaign&id=${campaignId}&status=cancelled`
        : `${origin}/pingpay/callback?type=project&id=${encodeURIComponent(recipientAccountId ?? "")}&status=cancelled`;

      const requestBody = isCampaign
        ? {
            amount: indivisibleAmount,
            asset: { chain: "NEAR", symbol: tokenSymbol },
            campaignId,
            donorAccountId,
            successUrl,
            cancelUrl,
          }
        : {
            amount: indivisibleAmount,
            asset: { chain: "NEAR", symbol: tokenSymbol },
            recipientAccountId,
            donorAccountId,
            successUrl,
            cancelUrl,
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      const url = data?.session?.sessionUrl ?? data?.sessionUrl;
      const sid = data?.session?.sessionId;

      if (!res.ok || !url) {
        setError(data?.error ?? "Failed to create payment link.");
        return;
      }

      // Store sessionId + donor so the callback page can attribute the sync
      if (sid) {
        try {
          localStorage.setItem("pingpay_session_id", sid);
          localStorage.setItem("pingpay_donor_account_id", donorAccountId);
        } catch {
          // localStorage unavailable, sync will be best-effort
        }
      }

      setSessionUrl(url);
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
          <DialogTitle>{sessionUrl ? "Payment Link Ready" : title}</DialogTitle>
        </DialogHeader>

        {!sessionUrl ? (
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
                  {isSubmitting ? "Creating…" : "Create Payment Link"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <>
            <DialogDescription>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
                  <p className="min-w-0 flex-1 truncate text-sm text-neutral-600">{sessionUrl}</p>
                </div>

                <p className="text-sm text-neutral-500">
                  {
                    "Share this link with anyone to let them complete the payment, or pay now yourself."
                  }
                </p>
              </div>
            </DialogDescription>

            <DialogFooter>
              <Button
                type="button"
                variant="brand-outline"
                color="black"
                onClick={handleCopy}
                className="gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy Link"}
              </Button>

              <Button
                type="button"
                variant="brand-filled"
                onClick={handlePayNow}
                className="w-full gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {"Pay Now"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
});
