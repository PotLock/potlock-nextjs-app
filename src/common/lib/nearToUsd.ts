"use client";

const nearToUsd = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd",
    { cache: "force-cache" },
  );

  if (response.ok) {
    const data = await response.json();
    return data.near.usd;
  }

  return "0";
};

export default nearToUsd;
