import Image from "next/image";

import { pagoda } from "@/common/api/pagoda";
import { NearIcon } from "@/common/assets/svgs";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { AccountId } from "@/common/types";
import { cn } from "@/common/ui/utils";

type TokenIconSize = "small" | "medium";

const variants: Record<
  TokenIconSize,
  { sizePx: number; rootClass: string; placeholderClass: string }
> = {
  small: { sizePx: 16, rootClass: "p-0.5", placeholderClass: "text-4" },
  medium: { sizePx: 22, rootClass: "p-1", placeholderClass: "text-5" },
};

export type TokenIconProps = {
  /**
   * Either "NEAR" or FT contract account id.
   */
  tokenId: "near" | AccountId;

  className?: string;
  size?: TokenIconSize;
};

export const TokenIcon = ({
  tokenId,
  className,
  size = "medium",
}: TokenIconProps) => {
  const { data: token, isLoading } = pagoda.useTokenMetadata({
    tokenId,
    disabled: tokenId === NEAR_TOKEN_DENOM,
  });

  const { sizePx, rootClass, placeholderClass } = variants[size];
  const tokenSymbolFallback = isLoading ? "⋯" : "🪙";
  return (
    <span
      className={cn("flex items-center justify-center", rootClass, className)}
    >
      {tokenId === NEAR_TOKEN_DENOM ? (
        <NearIcon
          width={sizePx + 4}
          height={sizePx + 4}
          className="color-neutral-950 m--1"
        />
      ) : (
        <>
          {token?.icon ? (
            <Image
              alt={`Token icon for ${token.name}`}
              src={token?.icon}
              width={sizePx}
              height={sizePx}
            />
          ) : (
            <span className={cn("prose", placeholderClass)}>
              {token?.symbol ?? tokenSymbolFallback}
            </span>
          )}
        </>
      )}
    </span>
  );
};