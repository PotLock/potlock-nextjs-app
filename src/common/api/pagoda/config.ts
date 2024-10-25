import { AxiosRequestConfig } from "axios";

import { NETWORK } from "@/common/config";
import { PAGODA_API_KEY } from "@/common/constants";

/**
 * Docs: https://console.pagoda.co/apis?tab=enhancedApi#/
 */
export const PAGODA_API_ENDPOINT =
  NETWORK === "mainnet"
    ? "https://near-mainnet.api.pagoda.co/eapi/v1/"
    : "https://near-testnet.api.pagoda.co/eapi/v1/";

/**
 * Request config for SWR
 */
export const PAGODA_REQUEST_CONFIG: Record<"axios", AxiosRequestConfig> = {
  axios: {
    baseURL: PAGODA_API_ENDPOINT,

    headers: {
      "Content-Type": "application/json",
      "x-api-key": PAGODA_API_KEY,
    },
  },
};
