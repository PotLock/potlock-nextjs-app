"use client";

const nearToUsd = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd",
  );

  if (response.ok) {
    const data = await response.json();
    console.log(data);
    return data.near.usd;
  }

  return "0";
};

export default nearToUsd;
