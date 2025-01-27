import { AxiosRequestConfig } from "axios";

/**
 * Request config for SWR
 */
export const REQUEST_CONFIG: Record<"axios", AxiosRequestConfig> = {
  axios: { baseURL: "https://prices.intear.tech" },
};
