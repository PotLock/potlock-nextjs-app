"server-only";

import { type KeyResponse, type PinResponse, PinataSDK } from "pinata-web3";
import { identity } from "remeda";

import { IPFS_GATEWAY_URL } from "@/common/_config";

export const sdk = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: IPFS_GATEWAY_URL,
});

export type FileUploadParams = {
  file: File;
};

export const upload = ({ file }: FileUploadParams): Promise<PinResponse> =>
  fetch("/api/pinata/get-auth-key")
    .then((response) => response.json())
    .then(({ JWT }: KeyResponse) => sdk.upload.file(file).key(JWT).then(identity()))
    .catch((error) => {
      throw new Error(error.message || "Unable to retrieve Pinata auth key");
    });
