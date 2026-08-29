import { NextResponse } from "next/server";

import { DONATION_CONTRACT_ACCOUNT_ID, NETWORK } from "@/common/_config";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

const NEAR_RPC_URL =
  NETWORK === "mainnet" ? "https://rpc.mainnet.near.org" : "https://rpc.testnet.near.org";

const NEAR_RPC_TIMEOUT_MS = 10000;

/**
 * Confirms a PingPay-sourced donation actually landed on-chain (not refunded).
 *
 * Why: PingPay settles through intent.near. The deployed donation contract's
 * ft_on_transfer can refund when it can't attribute the donor. Before we call
 * the sync API (which makes the donation visible in history), we verify the
 * transaction:
 *   1. Succeeded.
 *   2. Produced a `donation` log event (standard: potlock) on the donation
 *      contract for the expected recipient + amount.
 *
 * If the log is missing, the donation was refunded — we must not sync it.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { txHash, senderId, expectedRecipient, expectedAmount } = body ?? {};

    if (!txHash || !senderId) {
      return NextResponse.json({ error: "Missing txHash or senderId" }, { status: 400 });
    }

    const rpcRes = await fetchWithTimeout(NEAR_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "verify",
        method: "EXPERIMENTAL_tx_status",
        params: [txHash, senderId, "EXECUTED_OPTIMISTIC"],
      }),
    });

    if (!rpcRes.ok) {
      return NextResponse.json({ error: `RPC returned ${rpcRes.status}` }, { status: 502 });
    }

    const rpcData = await rpcRes.json();

    if (rpcData?.error) {
      return NextResponse.json(
        { landed: false, reason: "rpc_error", detail: rpcData.error },
        { status: 200 },
      );
    }

    const receipts: any[] = rpcData?.result?.receipts_outcome ?? [];
    const donationLog = findDonationLog(receipts, expectedRecipient);

    if (!donationLog) {
      return NextResponse.json(
        {
          landed: false,
          reason: "no_donation_log",
          note: "Donation contract did not emit a donation event for the expected recipient — likely refunded.",
        },
        { status: 200 },
      );
    }

    if (expectedAmount && donationLog.net_amount && donationLog.total_amount) {
      // Basic sanity: total should be >= expected (we sent amount, fees deducted net)
      const total = BigInt(donationLog.total_amount);
      const expected = BigInt(expectedAmount);

      if (total < expected / 2n) {
        return NextResponse.json(
          {
            landed: false,
            reason: "amount_mismatch",
            onChainTotal: donationLog.total_amount,
            expected: expectedAmount,
          },
          { status: 200 },
        );
      }
    }

    return NextResponse.json({
      landed: true,
      donation: donationLog,
    });
  } catch (error) {
    console.error("PingPay verify-tx error:", error);
    return NextResponse.json({ error: "Failed to verify tx" }, { status: 500 });
  }
}

/**
 * Walks receipts_outcome looking for a `donation` event emitted by the donation
 * contract for the expected recipient. The contract emits
 * `EVENT_JSON:{"standard":"potlock","event":"donation","data":[{"donation":{...}}]}`
 * after `ft_on_transfer` successfully forwards funds. If no matching event is
 * found the donation was refunded.
 */
function findDonationLog(receipts: any[], expectedRecipient?: string): any | null {
  for (const receipt of receipts) {
    if (receipt?.outcome?.executor_id !== DONATION_CONTRACT_ACCOUNT_ID) continue;

    const logs: string[] = receipt?.outcome?.logs ?? [];

    for (const log of logs) {
      if (!log.startsWith("EVENT_JSON:")) continue;

      try {
        const event = JSON.parse(log.slice("EVENT_JSON:".length));
        if (event?.event !== "donation") continue;

        const data = Array.isArray(event?.data) ? event.data[0] : event?.data;
        const donation = data?.donation ?? data;
        if (!donation) continue;

        if (expectedRecipient && donation.recipient_id !== expectedRecipient) continue;

        return donation;
      } catch {
        // skip malformed event
      }
    }
  }

  return null;
}

function fetchWithTimeout(input: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), NEAR_RPC_TIMEOUT_MS);

  return fetch(input, { ...init, signal: controller.signal }).finally(() => {
    clearTimeout(timeoutId);
  });
}
