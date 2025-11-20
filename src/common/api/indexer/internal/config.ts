import { AxiosRequestConfig } from "axios";

import { INDEXER_API_ENDPOINT_URL } from "@/common/_config";

/**
 * Request config for SWR
 */
export const INDEXER_CLIENT_CONFIG: Record<"axios", AxiosRequestConfig> = {
  axios: { baseURL: INDEXER_API_ENDPOINT_URL },
};

/**
 * Force to use testnet for staging
 * NOTE: this is temporary, we will remove this once we have a proper staging environment
 */
export const INDEXER_CLIENT_CONFIG_STAGING: Record<"axios", AxiosRequestConfig> = {
  axios: { baseURL: "https://dev.potlock.io" },
};
