import { PinataSDK } from "pinata-web3";

export const pinataClient = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: "example-gateway.mypinata.cloud",
});
