import React from "react";

interface CrossChainTokenAvatarProps {
  blockchain?: string;
  tokenSymbol?: string;
  className?: string;
}

// Token avatars mapping based on Modal2 implementation
const tokenAvatars: Array<{ src: string; name: string }> = [
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar.svg", name: "Sol" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(1).svg", name: "NEAR" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(2).svg", name: "USDC" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(3).svg", name: "Stellar" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(4).svg", name: "Base" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(5).svg", name: "Pol" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(6).svg", name: "Sui" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(7).svg", name: "Doge" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(8).svg", name: "Arb" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(9).svg", name: "Eth" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(10).svg", name: "Zec" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(11).svg", name: "BSC" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(12).svg", name: "XRP" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(13).svg", name: "Tron" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(14).svg", name: "USDT" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(15).svg", name: "Aurora" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(16).svg", name: "Aptos" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar17.png", name: "Avax" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar18.png", name: "Op" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar19.png", name: "Btc" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar20.png", name: "ton" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar21.png", name: "gnosis" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/Avatar23.jpeg", name: "Bera" },
  { src: "https://ik.imagekit.io/heuzdzbna/monad_logo.png", name: "Monad" },
];

function capitalizeAll(str: string): string {
  if (!str) return "";

  if (str.toUpperCase() === "GNOSIS") {
    return "GNO";
  } else {
    return str.toUpperCase();
  }
}

// Export utility function to get token avatar image URL
export function getTokenAvatarSrc(blockchain?: string, tokenSymbol?: string): string {
  // First try to find token avatar by symbol
  const tokenAvatar = tokenSymbol
    ? tokenAvatars.find((a) => a.name.toLowerCase() === tokenSymbol.toLowerCase())
    : null;

  // Then try to find blockchain avatar
  const blockchainAvatar = blockchain
    ? tokenAvatars.find((a) => a.name.toLowerCase() === blockchain.toLowerCase())
    : null;

  // Use token avatar if available, otherwise use blockchain avatar, otherwise use default
  return (
    tokenAvatar?.src ||
    blockchainAvatar?.src ||
    "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar22.jpeg"
  );
}

export const CrossChainTokenAvatar: React.FC<CrossChainTokenAvatarProps> = ({
  blockchain,
  tokenSymbol,
  className = "",
}) => {
  if (!blockchain && !tokenSymbol) {
    return null;
  }

  const avatarSrc = getTokenAvatarSrc(blockchain, tokenSymbol);

  const displayName = tokenSymbol
    ? capitalizeAll(tokenSymbol)
    : blockchain
      ? capitalizeAll(blockchain)
      : "";

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <img src={avatarSrc} alt={displayName} className="h-5 w-5 rounded-full object-cover" />
      <span className="text-sm font-medium">{displayName}</span>
    </div>
  );
};
