import { AxiosRequestConfig } from "axios";

import { INDEXER_API_ENDPOINT_URL } from "@/common/config";

/**
 * Request config for SWR
 */
export const POTLOCK_REQUEST_CONFIG: Record<"axios", AxiosRequestConfig> = {
  axios: { baseURL: INDEXER_API_ENDPOINT_URL },
};
