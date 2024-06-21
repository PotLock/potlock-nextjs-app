import useSWR from "swr";

import { COINGECKO_API_ENDPOINT } from "../../constants";

const fetcher = (url: string) =>
  fetch(COINGECKO_API_ENDPOINT + url).then((res) => res.json());

const fetcherWithTransform = (transform: Function) => (url: string) =>
  fetcher(url).then((data) => transform(data));

export const useOneNearUsdPrice = () =>
  useSWR(
    "/simple/price?ids=near&vs_currencies=usd",
    fetcherWithTransform((response: any) => response.near.usd),
  );
