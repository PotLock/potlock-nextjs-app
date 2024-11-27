import { AxiosRequestConfig } from "axios";

import { INDEXER_API_ENDPOINT_URL } from "@/common/_config";

/**
 * Request config for SWR
 */
export const INDEXER_CLIENT_CONFIG: Record<"axios", AxiosRequestConfig> = {
  axios: { baseURL: INDEXER_API_ENDPOINT_URL },
};
