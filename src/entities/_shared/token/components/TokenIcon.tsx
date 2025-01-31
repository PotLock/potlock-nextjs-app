import Image from "next/image";

import { NATIVE_TOKEN_ID } from "@/common/constants";
import { AccountId } from "@/common/types";
import { NearIcon } from "@/common/ui/svg";
import { cn } from "@/common/ui/utils";

import { useToken } from "../hooks/data";

type TokenIconSize = "xs" | "sm" | "md";

const variants: Record<
  TokenIconSize,
  { sizePx: number; rootClass: string; placeholderClass: string }
> = {
  xs: { sizePx: 16, rootClass: "p-0.5", placeholderClass: "text-4" },
  sm: { sizePx: 18, rootClass: "p-0.5", placeholderClass: "text-4" },
  md: { sizePx: 22, rootClass: "p-1", placeholderClass: "text-5" },
};

export type TokenIconProps = {
  /**
   * Either "NEAR" or FT contract account id.
   */
  tokenId: "near" | AccountId;

  className?: string;
  size?: TokenIconSize;
};

export const TokenIcon = ({ tokenId, className, size = "md" }: TokenIconProps) => {
  const { data: token } = useToken({ tokenId });
  const { sizePx, rootClass, placeholderClass } = variants[size];

  return (
    <span
      className={cn("color-neutral-950 flex items-center justify-center", rootClass, className)}
    >
      {tokenId === NATIVE_TOKEN_ID ? (
        <NearIcon width={sizePx} height={sizePx} className="color-inherit m--0.5" />
      ) : (
        <>
          {token?.metadata.icon ? (
            <Image
              alt={`Token icon for ${token.metadata.name}`}
              src={token?.metadata.icon}
              width={sizePx}
              height={sizePx}
            />
          ) : (
            <span className={cn("prose", placeholderClass)}>{token?.metadata.symbol ?? "..."}</span>
          )}
        </>
      )}
    </span>
  );
};
