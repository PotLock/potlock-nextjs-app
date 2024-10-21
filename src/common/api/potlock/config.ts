import { AxiosRequestConfig } from "axios";

import { NETWORK } from "@/common/constants";

/**
 * Docs: https://dev.potlock.io/api/schema/swagger-ui/
 */
export const POTLOCK_API_ENDPOINT =
  NETWORK === "mainnet"
    ? "https://dev.potlock.io"
    : "https://test-dev.potlock.io";

/**
 * Request config for SWR
 */
export const POTLOCK_REQUEST_CONFIG: Record<"axios", AxiosRequestConfig> = {
  axios: { baseURL: POTLOCK_API_ENDPOINT },
};
