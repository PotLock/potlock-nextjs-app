"use client";

import { Suspense, useEffect, useState } from "react";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { syncApi } from "@/common/api/indexer/sync";

const Spinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-neutral-50">
    <Loader2 className="h-12 w-12 animate-spin text-neutral-500" />
  </div>
);

function PingPayCallbackInner() {
  const searchParams = useSearchParams();
  const status = searchParams?.get("status") ?? null;
  const type = searchParams?.get("type") ?? null;
  const id = searchParams?.get("id") ?? null;

  const [showFallback, setShowFallback] = useState(false);

  const returnUrl =
    type === "campaign" ? `/campaign/${id}` : type === "project" ? `/profile/${id}` : "/";

  useEffect(() => {
    const run = async () => {
      if (status === "success" && id) {
        try {
          let sessionId: string | null = null;

          try {
            sessionId = localStorage.getItem("pingpay_session_id");
            localStorage.removeItem("pingpay_session_id");
            localStorage.removeItem("pingpay_donor_account_id");
          } catch {
            // localStorage unavailable
          }

          if (sessionId) {
            const data = await pollSessionStatus(sessionId);
            const txHash = data?.txHash ?? null;

            // PingPay routes donations through NEAR Intents — the on-chain tx
            // signer is always `intents.near`, regardless of which user wallet
            // PingPay reports as the payer. The sync endpoint passes this to
            // NEAR RPC's `tx` method, which requires the actual signer.
            const senderId = "intents.near";

            if (txHash) {
              if (type === "campaign") {
                await syncApi.campaignDonation(id, txHash, senderId);
              } else if (type === "project") {
                await syncApi.directDonation(txHash, senderId);
                // Recalculate the recipient's aggregate stats (total_donations_in_usd,
                // donors_count) — the donation sync only inserts the row.
                await syncApi.account(id);
              }
            }
          }
        } catch (e) {
          console.error("PingPay sync error:", e);
        }
      }

      try {
        const channel = new BroadcastChannel("pingpay");
        channel.postMessage({ type: "pingpay-complete", paymentStatus: status, kind: type, id });
        channel.close();
      } catch {
        // BroadcastChannel unsupported
      }

      window.close();
      setTimeout(() => setShowFallback(true), 800);
    };

    run();
  }, [status, type, id]);

  if (!showFallback) return <Spinner />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-xl bg-white p-8 shadow-sm">
        <p className="text-center text-sm text-neutral-700">
          {"Donation processed. You can close this tab."}
        </p>
        <a
          href={returnUrl}
          className="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-medium text-white"
        >
          {"Back to Potlock"}
        </a>
      </div>
    </div>
  );
}

export default function PingPayCallbackPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <PingPayCallbackInner />
    </Suspense>
  );
}

async function pollSessionStatus(sessionId: string): Promise<{
  status: string;
  txHash: string | null;
  senderId: string | null;
} | null> {
  // Keep a long settlement window, but back off so each checkout does not keep
  // a Vercel function hot with dozens of identical status calls.
  const delaysMs = [
    ...Array.from({ length: 5 }, () => 2000),
    ...Array.from({ length: 8 }, () => 5000),
    ...Array.from({ length: 8 }, () => 10000),
  ];

  let lastData: {
    status: string;
    txHash: string | null;
    senderId: string | null;
  } | null = null;

  for (let i = 0; i <= delaysMs.length; i++) {
    try {
      const res = await fetch(
        `/api/pingpay/session-status?sessionId=${encodeURIComponent(sessionId)}`,
      );

      if (res.ok) {
        const data = await res.json();
        lastData = data;
        const s = (data.status ?? "").toUpperCase();
        const isFail = s === "FAILED" || s === "CANCELLED" || s === "EXPIRED";
        const isSuccess = s === "COMPLETED" || s === "SUCCESS" || s === "SUCCEEDED";

        if (isFail) return data;
        if (isSuccess && data.txHash) return data;
      }
    } catch {
      // retry
    }

    const delayMs = delaysMs[i];
    if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
  }

  return lastData;
}
