import { NextResponse } from "next/server";

import { pinataClient } from "@/common/services/pinata";

export const dynamic = "force-dynamic";

/**
 * @link https://docs.pinata.cloud/frameworks/next-js-ipfs#create-api-route-2
 */
export async function GET() {
  try {
    const uuid = crypto.randomUUID();

    const keyData = await pinataClient.sdk.keys.create({
      keyName: uuid.toString(),
      maxUses: 1,
      permissions: { endpoints: { pinning: { pinFileToIPFS: true } } },
    });

    return NextResponse.json(keyData, { status: 200 });
  } catch (error) {
    console.error("Failed to create Pinata API key:", error);
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 });
  }
}
