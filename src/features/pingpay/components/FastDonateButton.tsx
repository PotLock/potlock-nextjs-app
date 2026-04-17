import { useCallback } from "react";

import { show } from "@ebay/nice-modal-react";

import { Button } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { useFungibleToken } from "@/entities/_shared/token";

import { PingPayModal } from "./PingPayModal";

export type FastDonateButtonProps = {
  recipientAccountId: string;
  tokenId: string;
  campaignId?: string | number;
  campaignName?: string;
  className?: string;
  disabled?: boolean;
};

export const FastDonateButton: React.FC<FastDonateButtonProps> = ({
  tokenId,
  campaignId,
  campaignName,
  className,
  disabled,
}) => {
  const { data: token } = useFungibleToken({ tokenId });
  const tokenSymbol = token?.metadata?.symbol;
  const tokenDecimals = token?.metadata?.decimals;

  const handleClick = useCallback(() => {
    if (campaignId === undefined || !tokenSymbol || tokenDecimals === undefined) return;

    show(PingPayModal, {
      tokenSymbol,
      tokenDecimals,
      campaignId,
      campaignName,
    });
  }, [tokenSymbol, tokenDecimals, campaignId, campaignName]);

  return (
    <Button
      variant="standard-outline"
      disabled={disabled || campaignId === undefined || !tokenSymbol}
      className={cn("w-full", className)}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      aria-label={campaignName ? `Create Payment link for ${campaignName}` : "Create Payment link"}
    >
      {tokenSymbol ? "Create Payment link" : "Loading…"}
    </Button>
  );
};
