import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PINGPAY_API_BASE = process.env.PINGPAY_API_BASE ?? "https://pay.pingpay.io/api";

// TODO: move to env var and rotate before going public.
const PINGPAY_API_KEY_FALLBACK = "VquZNJbyXyPLyduKgCQDSttpXvRITYqjSGnguJogjezGINxYhsjsBAoEFCMXOVEk";

/**
 * Fetches PingPay session + payment details to extract txHash and sender.
 * Used by the callback page to fire the correct sync call.
 */
export async function GET(req: Request) {
  try {
    const apiKey = process.env.PINGPAY_API_KEY ?? PINGPAY_API_KEY_FALLBACK;

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    // Fetch session to get paymentId
    const sessionRes = await fetch(`${PINGPAY_API_BASE}/checkout/sessions/${sessionId}`, {
      headers: { "x-api-key": apiKey },
    });

    if (!sessionRes.ok) {
      return NextResponse.json({ error: "Failed to fetch session" }, { status: sessionRes.status });
    }

    const sessionData = await sessionRes.json();
    const paymentId = sessionData?.session?.paymentId;

    if (!paymentId) {
      return NextResponse.json({
        status: sessionData?.session?.status ?? "UNKNOWN",
        txHash: null,
        senderId: null,
      });
    }

    // Fetch payment to get txHash and sender
    const paymentRes = await fetch(`${PINGPAY_API_BASE}/payments/${paymentId}`, {
      headers: { "x-api-key": apiKey },
    });

    if (!paymentRes.ok) {
      return NextResponse.json({
        status: sessionData?.session?.status ?? "UNKNOWN",
        txHash: null,
        senderId: null,
      });
    }

    const paymentData = await paymentRes.json();
    const payment = paymentData?.payment;

    return NextResponse.json({
      status: payment?.status ?? sessionData?.session?.status ?? "UNKNOWN",
      txHash: payment?.txHash ?? null,
      senderId: payment?.request?.payer?.address ?? null,
      recipient: payment?.request?.recipient?.address ?? null,
      amount: payment?.request?.amount ?? null,
      assetSymbol: payment?.request?.asset?.symbol ?? null,
      sessionMetadata: sessionData?.session?.metadata ?? null,
    });
  } catch (error) {
    console.error("PingPay session-status error:", error);
    return NextResponse.json({ error: "Failed to fetch session status" }, { status: 500 });
  }
}
