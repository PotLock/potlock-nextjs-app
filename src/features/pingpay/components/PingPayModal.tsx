import { useCallback, useEffect, useState } from "react";

import { create, useModal } from "@ebay/nice-modal-react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useForm } from "react-hook-form";

import { nearProtocolClient } from "@/common/blockchains/near-protocol";
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

import { PINGPAY_USDC_TOKEN_CONTRACT_ID } from "../constants";

// Fallback registration deposit when the FT contract's storage_balance_bounds
// is unavailable. Mirrors what direct-ft-donation.ts uses for headroom.
const STORAGE_DEPOSIT_FALLBACK_YOCTO = "100000000000000000000000"; // 0.1 NEAR

const ftContractIdForSymbol = (symbol: string): string | null => {
  if (symbol.toUpperCase() === "USDC") return PINGPAY_USDC_TOKEN_CONTRACT_ID;
  return null;
};

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
  // null = not yet checked; true = recipient is unregistered on the FT contract
  // and will need a one-time storage_deposit before PingPay can settle.
  const [needsStorageDeposit, setNeedsStorageDeposit] = useState<boolean | null>(null);

  const ftContractId = ftContractIdForSymbol(tokenSymbol);

  // Pre-flight: check whether the recipient has storage on the FT token contract.
  // PingPay routes through intents.near and skips the storage_deposit step the
  // native flow performs; if the recipient isn't registered, the donation
  // contract refunds the FT transfer.
  useEffect(() => {
    if (isCampaign || !recipientAccountId || !ftContractId) {
      setNeedsStorageDeposit(false);
      return;
    }

    let cancelled = false;
    setNeedsStorageDeposit(null);

    const tokenClient = nearProtocolClient.contractApi({ contractId: ftContractId });

    tokenClient
      .view<{ account_id: string }, { total: string; available: string } | null>(
        "storage_balance_of",
        { args: { account_id: recipientAccountId } },
      )
      .then((balance) => {
        if (cancelled) return;
        setNeedsStorageDeposit(balance === null);
      })
      .catch(() => {
        if (cancelled) return;
        // On view failure, don't block the user — assume registered and let
        // the on-chain flow surface a real error if it fails.
        setNeedsStorageDeposit(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isCampaign, recipientAccountId, ftContractId]);

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
      // Register the recipient on the FT contract before creating the PingPay
      // session. If the donor cancels or signing fails, abort — no payment link
      // is created, so no funds are at risk.
      if (!isCampaign && recipientAccountId && ftContractId && needsStorageDeposit === true) {
        try {
          const tokenClient = nearProtocolClient.contractApi({ contractId: ftContractId });

          let depositYocto = STORAGE_DEPOSIT_FALLBACK_YOCTO;

          try {
            const bounds = await tokenClient.view<{}, { min: string; max: string }>(
              "storage_balance_bounds",
            );

            // Prefer the contract's declared minimum; fall back if missing.
            if (bounds?.min) depositYocto = bounds.min;
          } catch {
            // keep fallback
          }

          await tokenClient.call("storage_deposit", {
            args: { account_id: recipientAccountId },
            deposit: depositYocto,
            gas: "100000000000000",
          });

          setNeedsStorageDeposit(false);
        } catch (storageErr) {
          console.error("FT storage_deposit pre-flight failed:", storageErr);

          setError(
            "Could not register this project on the token contract. " +
              "Please try again or use a different wallet.",
          );

          setIsSubmitting(false);
          return;
        }
      }

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

                {needsStorageDeposit === true && (
                  <p className="mt-2 text-xs italic text-neutral-500">
                    {`Note: This project hasn't received ${tokenSymbol} before. A one-time ~0.1 NEAR registration will be signed from your wallet so the donation can settle on-chain.`}
                  </p>
                )}
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
