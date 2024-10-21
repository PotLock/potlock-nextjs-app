import useSWR from "swr";

import { CLIENT_CONFIG, client } from "./client";

export const useOneNearUsdPrice = () =>
  useSWR(
    "/simple/price?ids=near&vs_currencies=usd",
    (url: string) => client.get(url).then((response) => response.data.near.usd),
    CLIENT_CONFIG.swr,
  );
