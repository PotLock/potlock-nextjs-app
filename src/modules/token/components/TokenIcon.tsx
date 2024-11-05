import Image from "next/image";

import { NearIcon } from "@/common/assets/svgs";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { ftService } from "@/common/services";
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
  const { data: token } = ftService.useRegisteredToken({ tokenId });
  const { sizePx, rootClass, placeholderClass } = variants[size];

  return (
    <span
      className={cn("flex items-center justify-center", rootClass, className)}
    >
      {tokenId === NATIVE_TOKEN_ID ? (
        <NearIcon
          width={sizePx + 4}
          height={sizePx + 4}
          className="color-neutral-950 m--1"
        />
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
            <span className={cn("prose", placeholderClass)}>
              {token?.metadata.symbol ?? "..."}
            </span>
          )}
        </>
      )}
    </span>
  );
};
