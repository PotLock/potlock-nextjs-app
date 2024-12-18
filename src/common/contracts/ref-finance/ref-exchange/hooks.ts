import useSWR from "swr";

import * as client from "./client";

export const useWhitelistedTokens = () =>
  useSWR(["get_whitelisted_tokens"], () => client.get_whitelisted_tokens());
