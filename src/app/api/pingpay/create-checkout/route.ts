import { NextResponse } from "next/server";

import { CAMPAIGNS_CONTRACT_ACCOUNT_ID } from "@/common/_config";

export const dynamic = "force-dynamic";

const PINGPAY_API_BASE = process.env.PINGPAY_API_BASE ?? "https://pay.pingpay.io/api";

// TODO: move to env var and rotate before going public.
const PINGPAY_API_KEY_FALLBACK =
  "VquZNJbyXyPLyduKgCQDSttpXvRITYqjSGnguJogjezGINxYhsjsBAoEFCMXOVEk";

/**
 * Creates a PingPay Hosted Checkout session that settles to the POTLOCK
 * campaigns contract. Routing to a specific campaign is done via
 * `customRecipientMsg`, which the contract's `ft_on_transfer` decodes.
 *
 * Setup requirement: in the PingPay dashboard, the NEAR recipient address
 * must be set to {@link CAMPAIGNS_CONTRACT_ACCOUNT_ID}. PingPay's API ignores
 * any per-request recipient and always settles to the dashboard-configured one.
 *
 * @link https://pingpay.gitbook.io/docs/pingpay-api/hosted-checkout/create-checkout
 */
export async function POST(req: Request) {
  try {
    const apiKey = process.env.PINGPAY_API_KEY ?? PINGPAY_API_KEY_FALLBACK;

    const body = await req.json();

    const {
      amount,
      asset,
      campaignId,
      referrerAccountId,
      donorAccountId,
      donorMessage,
      successUrl,
      cancelUrl,
    } = body ?? {};

    if (!amount || campaignId === undefined || campaignId === null) {
      return NextResponse.json(
        { error: "Missing required fields: amount, campaignId" },
        { status: 400 },
      );
    }

    const donorTag = donorAccountId ? `[PingPay donor: ${donorAccountId}]` : "[via PingPay]";
    const taggedMessage = donorMessage ? `${donorTag} ${donorMessage}` : donorTag;

    const customRecipientMsg = JSON.stringify({
      campaign_id: typeof campaignId === "string" ? Number(campaignId) : campaignId,
      referrer_id: referrerAccountId ?? null,
      bypass_protocol_fee: false,
      bypass_creator_fee: false,
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
        recipient: CAMPAIGNS_CONTRACT_ACCOUNT_ID,
        customRecipientMsg,
        successUrl,
        cancelUrl,
        metadata: {
          source: "potlock",
          campaignId: campaignId.toString(),
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
    console.error("PingPay checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
