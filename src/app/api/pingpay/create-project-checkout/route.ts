import { NextResponse } from "next/server";

import { DONATION_CONTRACT_ACCOUNT_ID } from "@/common/_config";

export const dynamic = "force-dynamic";

const PINGPAY_API_BASE = process.env.PINGPAY_API_BASE ?? "https://pay.pingpay.io/api";

// TODO: move to env var and rotate before going public.
const PINGPAY_API_KEY_FALLBACK = "VquZNJbyXyPLyduKgCQDSttpXvRITYqjSGnguJogjezGINxYhsjsBAoEFCMXOVEk";

/**
 * Creates a PingPay Hosted Checkout session that settles to the POTLOCK
 * donation contract for a direct project donation. Routing to the recipient
 * account is done via `customRecipientMsg`, which the contract's
 * `ft_on_transfer` decodes.
 *
 * Setup requirement: in the PingPay dashboard, the NEAR recipient address
 * must be set to {@link DONATION_CONTRACT_ACCOUNT_ID}. PingPay's API ignores
 * any per-request recipient and always settles to the dashboard-configured one.
 */
export async function POST(req: Request) {
  try {
    const apiKey = process.env.PINGPAY_API_KEY ?? PINGPAY_API_KEY_FALLBACK;

    const body = await req.json();

    const {
      amount,
      asset,
      recipientAccountId,
      referrerAccountId,
      donorAccountId,
      donorMessage,
      successUrl,
      cancelUrl,
    } = body ?? {};

    if (!amount || !recipientAccountId) {
      return NextResponse.json(
        { error: "Missing required fields: amount, recipientAccountId" },
        { status: 400 },
      );
    }

    // Embed donor account in the on-chain message so the real donor is
    // recoverable — sender_id on the FT transfer is intent.near (PingPay's
    // settlement gateway), not the human donor.
    const donorTag = donorAccountId ? `[PingPay donor: ${donorAccountId}]` : "[via PingPay]";
    const taggedMessage = donorMessage ? `${donorTag} ${donorMessage}` : donorTag;

    const customRecipientMsg = JSON.stringify({
      recipient_id: recipientAccountId,
      referrer_id: referrerAccountId ?? null,
      bypass_protocol_fee: false,
      message: taggedMessage,
    });

    const response = await fetch(`${PINGPAY_API_BASE}/checkout/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        amount,
        asset,
        recipient: DONATION_CONTRACT_ACCOUNT_ID,
        customRecipientMsg,
        successUrl,
        cancelUrl,
        metadata: {
          source: "potlock",
          recipientAccountId,
          donorAccountId: donorAccountId ?? null,
        },
      }),
    });

    const text = await response.text();
    let data: any;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { error: text || "Non-JSON response from PingPay" };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message ?? data?.error ?? "Failed to create PingPay checkout" },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("PingPay project checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
