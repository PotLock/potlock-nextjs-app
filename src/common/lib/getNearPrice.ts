// import { useQuery } from "@tanstack/react-query";

// const useNearPrice = () => {
//   const { isPending, error, data } = useQuery({
//     queryKey: ["nearToUsd"],
//     queryFn: () =>
//       fetch(
//         "https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd",
//       ).then((res) => res.json()),
//   });
//   return { isPending, error, nearToUsd: data.near.usd };
// };

// export default useNearPrice;
