import "server-only";

import { PinataSDK } from "pinata-web3";

import { IPFS_GATEWAY_URL } from "@/common/_config";

export const pinataClient = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: IPFS_GATEWAY_URL,
});
