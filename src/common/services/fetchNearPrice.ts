"use client";
export const fetchNearPrice = async (): Promise<number> => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd",
    { cache: "force-cache" },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch NEAR price");
  }
  const data = await response.json();
  return data.near.usd;
};
